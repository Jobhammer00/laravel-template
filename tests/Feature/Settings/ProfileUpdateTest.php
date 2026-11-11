<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\Rules\Email;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get(route('profile.edit'));

        $response->assertOk();
    }

    public function test_profile_information_can_be_updated()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Test User',
                'email' => 'test@example.com',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertSame('Test User', $user->name);
        $this->assertSame('test@example.com', $user->email);
        $this->assertNull($user->email_verified_at);
    }

    public function test_email_verification_status_is_unchanged_when_the_email_address_is_unchanged()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Test User',
                'email' => $user->email,
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->refresh()->email_verified_at);
    }

    public function test_the_address_is_stored_in_lowercase_so_login_still_finds_it()
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch(route('profile.update'), ['name' => 'Test User', 'email' => ' Test@Example.com '])
            ->assertSessionHasNoErrors();

        $this->assertSame('test@example.com', $user->refresh()->email);
    }

    public function test_only_a_changed_address_is_checked_for_a_mail_domain()
    {
        // The MX check as outside tests; a reserved domain fails it offline.
        Email::defaults(fn (): Email => (new Email)->rfcCompliant()->validateMxRecord());
        $user = User::factory()->create(['email' => 'reviewer@example.com']);

        $this->actingAs($user)
            ->patch(route('profile.update'), ['name' => 'Test User', 'email' => 'reviewer@example.com'])
            ->assertSessionHasNoErrors();

        $this->actingAs($user)
            ->patch(route('profile.update'), ['name' => 'Test User', 'email' => 'other@example.com'])
            ->assertSessionHasErrors('email');
    }

    public function test_the_address_of_a_deleted_user_cannot_be_taken()
    {
        User::factory()->create(['email' => 'sylvia@example.com'])->delete();
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch(route('profile.update'), ['name' => 'Test User', 'email' => 'sylvia@example.com'])
            ->assertSessionHasErrors(['email' => 'Dit adres hoort bij een verwijderde gebruiker. Maak via "Gebruiker toevoegen" een gebruiker op dit adres aan om die terug te zetten.']);
    }
}
