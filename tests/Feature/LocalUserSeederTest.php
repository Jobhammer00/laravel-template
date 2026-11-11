<?php

use App\Enums\Role;
use App\Models\User;
use Database\Seeders\LocalUserSeeder;
use Illuminate\Support\Facades\Hash;

test('it makes a test user per role and an inactive one, also on a second run', function () {
    $this->seed(LocalUserSeeder::class);
    $this->seed(LocalUserSeeder::class);

    $users = User::where('email', 'like', 'info+%@code14.nl')->get();

    expect($users)->toHaveCount(4)
        ->and($users->pluck('role')->unique()->values()->all())->toEqualCanonicalizing(Role::cases())
        ->and($users->where('is_active', false)->pluck('email')->all())->toBe(['info+inactief@code14.nl'])
        ->and($users->every(fn (User $user) => Hash::check(LocalUserSeeder::PASSWORD, $user->password)))->toBeTrue();
});

test('it refuses to run outside a local environment', function () {
    app()['env'] = 'production';

    expect(fn () => app(LocalUserSeeder::class)->run())->toThrow(RuntimeException::class, 'LocalUserSeeder only runs locally.');
    expect(User::count())->toBe(0);
});
