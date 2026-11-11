<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

/**
 * Runs on production too, on a known address: never fall back to a default
 * password.
 */
class UserSeeder extends Seeder
{
    public const string EMAIL = 'info@code14.nl';

    public function run(): void
    {
        $this->call(PermissionSeeder::class);

        $password = config('auth.admin_password');

        if (! is_string($password) || $password === '') {
            throw new RuntimeException(
                'ADMIN_PASSWORD is not set; the admin account is not created without a password of its own.'
            );
        }

        $user = User::withTrashed()->firstOrNew(['email' => self::EMAIL]);

        $user->name = $user->exists ? $user->name : 'Beheerder Code 14';
        $user->is_active = true;
        $user->deleted_at = null;
        $user->email_verified_at ??= Carbon::now();

        if (! $user->exists || ! Hash::check($password, $user->password)) {
            $user->password = $password;
        }

        $user->applyRole(Role::Admin);
    }
}
