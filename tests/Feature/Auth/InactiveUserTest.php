<?php

use App\Models\User;

test('an inactive user cannot log in', function () {
    $user = User::factory()->inactive()->create();

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password'])
        ->assertSessionHasErrors(['email' => 'Dit account is niet actief.']);

    $this->assertGuest();
});

test('a running session ends once the user is set to inactive', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->get(route('dashboard'))->assertOk();

    $user->update(['is_active' => false]);

    $this->get(route('dashboard'))
        ->assertRedirect(route('login'))
        ->assertSessionHasErrors(['email' => 'Dit account is niet actief.']);
    $this->assertGuest();
});

test('a deleted user cannot log in', function () {
    $user = User::factory()->create();
    $user->delete();

    $this->post(route('login.store'), ['email' => $user->email, 'password' => 'password']);

    $this->assertGuest();
});
