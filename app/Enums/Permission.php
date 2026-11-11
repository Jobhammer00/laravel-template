<?php

namespace App\Enums;

/**
 * The values are spatie permission names: never rename one. PermissionSeeder
 * creates every case on each deploy; no migration per right.
 */
enum Permission: string
{
    case ManageUsers = 'manage_users';

    public function label(): string
    {
        return match ($this) {
            self::ManageUsers => 'Gebruikers en rechten beheren',
        };
    }

    public function group(): PermissionGroup
    {
        return match ($this) {
            self::ManageUsers => PermissionGroup::General,
        };
    }
}
