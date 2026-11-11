<?php

namespace Database\Seeders;

use App\Enums\Role;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use RuntimeException;

/**
 * Local only: the weak password must never reach acceptance or production.
 */
class LocalUserSeeder extends Seeder
{
    use WithoutModelEvents;

    public const PASSWORD = '123456';

    public function run(): void
    {
        if (! app()->environment('local', 'testing')) {
            throw new RuntimeException('LocalUserSeeder only runs locally.');
        }

        $this->call(PermissionSeeder::class);

        $users = [
            ['email' => 'info+admin@code14.nl', 'name' => 'Test Admin', 'role' => Role::Admin, 'is_active' => true],
            ['email' => 'info+medewerker@code14.nl', 'name' => 'Test Medewerker', 'role' => Role::Employee, 'is_active' => true],
            ['email' => 'info+inactief@code14.nl', 'name' => 'Test Inactief', 'role' => Role::Employee, 'is_active' => false],
        ];

        foreach ($users as $attributes) {
            $user = User::withTrashed()->firstOrNew(['email' => $attributes['email']]);
            $user->deleted_at = null;
            $user->name = $attributes['name'];
            $user->password = self::PASSWORD;
            $user->email_verified_at ??= Carbon::now();
            $user->is_active = $attributes['is_active'];

            $user->applyRole($attributes['role']);
        }
    }
}
