<?php

use App\Enums\Permission;
use App\Enums\Role;
use App\Models\User;
use App\Notifications\UserInvitation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Email;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Permission as SpatiePermission;

function storeSession(User $user): void
{
    DB::table('sessions')->insert([
        'id' => 'session-of-' . $user->id,
        'user_id' => $user->id,
        'payload' => '',
        'last_activity' => now()->getTimestamp(),
    ]);
}

function validUserData(array $overrides = []): array
{
    return [
        'name' => 'Sylvia de Wit',
        'email' => 'sylvia@example.com',
        'role' => Role::Employee->value,
        'is_active' => true,
        'permissions' => [],
        ...$overrides,
    ];
}

/**
 * Every right, as the sorted values the pages receive. The admin has all of
 * them, and each ticket adds some.
 *
 * @param  iterable<Permission|string>  $permissions
 * @return list<string>
 */
function sortedValues(iterable $permissions): array
{
    return collect($permissions)
        ->map(fn (Permission|string $permission) => $permission instanceof Permission ? $permission->value : $permission)
        ->sort()
        ->values()
        ->all();
}

beforeEach(function () {
    $this->admin = User::factory()->admin()->create(['name' => 'Ben Kramer']);
});

test('the overview lists users with their role, status and number of rights', function () {
    User::factory()->create(['name' => 'Laura Smit', 'is_active' => false]);

    $this->actingAs($this->admin)
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/Index')
            ->where('permissionTotal', count(Permission::cases()))
            ->has('users', 2)
            ->where('users.1.name', 'Laura Smit')
            ->where('users.1.is_active', false)
            ->where('users.1.permissions', [])
            ->where('users.0.permissions', array_column(Permission::cases(), 'value')),
        );
});

test('a right in the database without an enum case is skipped instead of breaking the overview', function () {
    $user = User::factory()->create(['name' => 'Laura Smit']);
    $user->givePermissionTo(SpatiePermission::findOrCreate('removed_right'));

    $this->actingAs($this->admin)
        ->get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('users.1.permissions', []));
});

test('an admin can add a user, who gets an invitation', function () {
    Notification::fake();

    $this->actingAs($this->admin)
        ->post(route('users.store'), validUserData(['email' => 'Sylvia@Laravel.example']))
        ->assertSessionHasNoErrors();

    $user = User::where('email', 'sylvia@example.com')->sole();

    expect($user->role)->toBe(Role::Employee)
        ->and($user->is_active)->toBeTrue()
        ->and($user->getPermissionNames()->all())->toBe([]);

    Notification::assertSentTo($user, UserInvitation::class);
});

test('a second user on the same address is refused with a readable message', function () {
    User::factory()->create(['email' => 'sylvia@example.com']);

    $this->actingAs($this->admin)
        ->post(route('users.store'), validUserData())
        ->assertSessionHasErrors(['email' => 'E-mailadres is al in gebruik.']);
});

test('adding the address of a deleted user restores that user', function () {
    Notification::fake();
    $deleted = User::factory()->create(['email' => 'sylvia@example.com']);
    $deleted->delete();

    $this->actingAs($this->admin)
        ->post(route('users.store'), validUserData(['name' => 'Sylvia Terug']))
        ->assertSessionHasNoErrors();

    expect(User::withTrashed()->where('email', 'sylvia@example.com')->count())->toBe(1)
        ->and($deleted->refresh()->trashed())->toBeFalse()
        ->and($deleted->name)->toBe('Sylvia Terug');
});

test('a restored user starts clean and only gets in through the invitation', function () {
    Notification::fake();
    $deleted = User::factory()->withTwoFactor()->create([
        'email' => 'sylvia@example.com',
        'remember_token' => 'old-token',
    ]);
    $deleted->delete();
    storeSession($deleted);

    $this->actingAs($this->admin)
        ->post(route('users.store'), validUserData())
        ->assertSessionHas('inertia.flash_data.toast.message', 'Verwijderde gebruiker teruggezet. Er is een uitnodiging verstuurd.');

    $restored = $deleted->refresh();

    expect(Hash::check('password', $restored->password))->toBeFalse()
        ->and($restored->remember_token)->toBeNull()
        ->and($restored->two_factor_secret)->toBeNull()
        ->and($restored->two_factor_confirmed_at)->toBeNull();

    $this->assertDatabaseMissing('sessions', ['user_id' => $restored->id]);

    Notification::assertSentTo($restored, UserInvitation::class);
});

test('the invitation holds a working password link', function () {
    $user = User::factory()->create();

    $url = (new UserInvitation)->toMail($user)->actionUrl;
    parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
    $token = basename((string) parse_url($url, PHP_URL_PATH));

    expect($query['email'])->toBe($user->email)
        ->and(Password::broker()->tokenExists($user, $token))->toBeTrue();
});

test('the address of a deleted user cannot be taken by another user', function () {
    User::factory()->create(['email' => 'sylvia@example.com'])->delete();
    $other = User::factory()->create();

    $this->actingAs($this->admin)
        ->put(route('users.update', $other), validUserData())
        ->assertSessionHasErrors(['email' => 'Dit adres hoort bij een verwijderde gebruiker. Maak via "Gebruiker toevoegen" een gebruiker op dit adres aan om die terug te zetten.']);
});

test('an unknown right is a validation error, also when editing yourself', function () {
    $this->actingAs($this->admin)
        ->put(route('users.update', $this->admin), validUserData([
            'email' => $this->admin->email,
            'role' => Role::Admin->value,
            'permissions' => ['bogus'],
        ]))
        ->assertSessionHasErrors(['permissions.0']);
});

test('rights can deviate from the role in both directions and stay that way', function () {
    $user = User::factory()->admin()->create();

    $this->actingAs($this->admin)
        ->put(route('users.update', $user), validUserData([
            'email' => $user->email,
            'role' => Role::Admin->value,
            'permissions' => [],
        ]))
        ->assertSessionHasNoErrors();

    expect($user->refresh()->getPermissionNames()->all())->toBe([]);

    $this->actingAs($this->admin)
        ->put(route('users.update', $user), validUserData([
            'email' => $user->email,
            'permissions' => [Permission::ManageUsers->value],
        ]))
        ->assertSessionHasNoErrors();

    expect($user->refresh()->role)->toBe(Role::Employee)
        ->and($user->getPermissionNames()->all())->toBe([Permission::ManageUsers->value]);
});

test('the edit page offers each role with its template of rights', function () {
    $this->actingAs($this->admin)
        ->get(route('users.edit', $this->admin))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('users/Edit')
            ->where('user.permissions', fn ($values) => sortedValues($values) === sortedValues(Permission::cases()))
            ->has('roles', count(Role::cases()))
            ->where('roles.2.value', Role::Admin->value)
            ->where('roles.1.permissions', fn ($values) => sortedValues($values) === sortedValues(Permission::cases()))
            ->where('permissionGroups.0.label', 'Algemeen'),
        );
});

test('only another user can be deleted', function () {
    $this->actingAs($this->admin)
        ->get(route('users.edit', $this->admin))
        ->assertInertia(fn (Assert $page) => $page->where('canDelete', false));

    $this->actingAs($this->admin)
        ->get(route('users.edit', User::factory()->create()))
        ->assertInertia(fn (Assert $page) => $page->where('canDelete', true));
});

test('only a new or changed address is checked for a mail domain', function () {
    // The MX check as outside tests; a reserved domain fails it offline.
    Email::defaults(fn (): Email => (new Email)->rfcCompliant()->validateMxRecord());
    $user = User::factory()->create(['email' => 'pim@example.com']);

    $this->actingAs($this->admin)
        ->put(route('users.update', $user), validUserData(['email' => 'pim@example.com']))
        ->assertSessionHasNoErrors();

    $this->actingAs($this->admin)
        ->put(route('users.update', $user), validUserData(['email' => 'other@example.com']))
        ->assertSessionHasErrors('email');

    $this->actingAs($this->admin)
        ->post(route('users.store'), validUserData())
        ->assertSessionHasErrors('email');
});

test('an admin can set a user to inactive', function () {
    $user = User::factory()->create();

    $this->actingAs($this->admin)
        ->put(route('users.update', $user), validUserData(['email' => $user->email, 'is_active' => false]))
        ->assertSessionHasNoErrors();

    expect($user->refresh()->is_active)->toBeFalse();
});

test('deleting a user is a soft delete', function () {
    $user = User::factory()->withPermissions([Permission::ManageUsers])->create();
    storeSession($user);

    $this->actingAs($this->admin)
        ->delete(route('users.destroy', $user))
        ->assertRedirect(route('users.index'));

    $this->assertSoftDeleted($user);
    $this->assertDatabaseHas('model_has_permissions', ['model_id' => $user->id]);
    $this->assertDatabaseMissing('sessions', ['user_id' => $user->id]);
});

test('an admin cannot lock themselves out', function () {
    $this->actingAs($this->admin)
        ->put(route('users.update', $this->admin), validUserData([
            'email' => $this->admin->email,
            'role' => Role::Admin->value,
            'is_active' => false,
            'permissions' => [],
        ]))
        ->assertSessionHasErrors([
            'is_active' => 'Je kunt je eigen account niet op inactief zetten.',
            'permissions' => 'Je kunt je eigen rol en rechten niet wijzigen.',
        ]);

    $this->actingAs($this->admin)->delete(route('users.destroy', $this->admin))->assertForbidden();

    expect($this->admin->refresh()->trashed())->toBeFalse()
        ->and($this->admin->is_active)->toBeTrue()
        ->and($this->admin->getPermissionNames()->all())->toEqualCanonicalizing(array_column(Permission::cases(), 'value'));
});

test('you cannot change your own role or rights, but can save the rest', function (array $change) {
    $all = array_column(Permission::cases(), 'value');
    $data = fn (array $override = []) => validUserData([
        'email' => $this->admin->email,
        'role' => Role::Admin->value,
        'permissions' => $all,
        ...$override,
    ]);

    $this->actingAs($this->admin)
        ->put(route('users.update', $this->admin), $data($change))
        ->assertSessionHasErrors(['permissions' => 'Je kunt je eigen rol en rechten niet wijzigen.']);

    $this->actingAs($this->admin)
        ->put(route('users.update', $this->admin), $data(['name' => 'Nieuwe naam', 'permissions' => array_reverse($all)]))
        ->assertSessionHasNoErrors();

    expect($this->admin->refresh()->name)->toBe('Nieuwe naam')
        ->and($this->admin->role)->toBe(Role::Admin);
})->with([
    'another role' => [['role' => Role::Employee->value]],
    'a right less' => [['permissions' => []]],
]);

test('without the right every user management route is refused', function (string $method, string $route, bool $withUser) {
    $user = User::factory()->role(Role::Employee)->create();
    $target = User::factory()->create();

    $this->actingAs($user)
        ->{$method}(route($route, $withUser ? $target : []), validUserData())
        ->assertForbidden();
})->with([
    'overview' => ['get', 'users.index', false],
    'create page' => ['get', 'users.create', false],
    'store' => ['post', 'users.store', false],
    'edit page' => ['get', 'users.edit', true],
    'update' => ['put', 'users.update', true],
    'destroy' => ['delete', 'users.destroy', true],
]);

test('the menu only gets the rights the user has', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where('auth.permissions', []));

    $this->actingAs($this->admin)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page->where(
            'auth.permissions',
            fn ($values) => sortedValues($values) === sortedValues(Permission::cases()),
        ));
});

test('registering an account yourself is no longer possible', function () {
    $this->get('/register')->assertNotFound();
});

test('the invitation button has the primary colour of the application', function () {
    $html = (string) (new UserInvitation)->toMail(User::factory()->create())->render();

    expect($html)->toContain('background-color: #0ea86d');
});
