<?php

use App\Enums\Permission;
use App\Enums\Role;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Support\Facades\Hash;

beforeEach(fn () => config(['auth.admin_password' => 'een-lang-testwachtwoord']));

test('it makes an active admin with every right on info@code14.nl', function () {
    $this->seed(UserSeeder::class);

    $admin = User::where('email', 'info@code14.nl')->sole();

    expect($admin->role)->toBe(Role::Admin)
        ->and($admin->is_active)->toBeTrue()
        ->and($admin->getPermissionNames()->all())->toEqualCanonicalizing(array_column(Permission::cases(), 'value'))
        ->and(Hash::check('een-lang-testwachtwoord', $admin->password))->toBeTrue();
});

test('running it again makes no second account and restores the admin', function () {
    $this->seed(UserSeeder::class);
    $admin = User::where('email', 'info@code14.nl')->sole();
    $admin->syncPermissions([]);
    $admin->update(['is_active' => false]);
    $admin->delete();

    $this->seed(UserSeeder::class);

    expect(User::withTrashed()->where('email', 'info@code14.nl')->count())->toBe(1)
        ->and($admin->refresh()->trashed())->toBeFalse()
        ->and($admin->is_active)->toBeTrue()
        ->and($admin->getPermissionNames()->all())->toEqualCanonicalizing(array_column(Permission::cases(), 'value'));
});

test('running it again puts a changed admin password back, as a way back in (B153)', function () {
    $this->seed(UserSeeder::class);
    $admin = User::where('email', 'info@code14.nl')->sole();
    $admin->update(['password' => 'zelf-gekozen-wachtwoord']);

    $this->seed(UserSeeder::class);

    expect(Hash::check('een-lang-testwachtwoord', $admin->refresh()->password))->toBeTrue();
});

test('it fails without a password and makes no account', function (?string $password) {
    config(['auth.admin_password' => $password]);

    expect(fn () => $this->seed(UserSeeder::class))
        ->toThrow(RuntimeException::class, 'ADMIN_PASSWORD is not set');

    expect(User::count())->toBe(0);
})->with([null, '']);
