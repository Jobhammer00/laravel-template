<?php

namespace Database\Seeders;

use App\Enums\Permission;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission as SpatiePermission;
use Spatie\Permission\PermissionRegistrar;

/**
 * Creates every right of the Permission enum. Runs on every deploy, so it only
 * creates: a renamed or mistyped case must never silently wipe the grants of a
 * right. Removing one stays a deliberate step.
 */
class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Permission::cases() as $permission) {
            SpatiePermission::findOrCreate($permission->value, 'web');
        }

        // Callers with WithoutModelEvents skip spatie's own cache flush.
        app(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
