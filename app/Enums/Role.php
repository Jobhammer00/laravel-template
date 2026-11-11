<?php

namespace App\Enums;

/**
 * A template: its permissions are copied onto the user. Changing a role here
 * does not reach existing users until the role is applied again.
 * Add the project's own roles here; Admin always gets every permission.
 */
enum Role: string
{
    case Employee = 'employee';
    case Admin = 'admin';

    public function label(): string
    {
        return match ($this) {
            self::Employee => 'Medewerker',
            self::Admin => 'Admin',
        };
    }

    public function tag(): string
    {
        return match ($this) {
            self::Employee => 'dagelijks werk',
            self::Admin => 'alles, incl. userbeheer',
        };
    }

    /**
     * @return list<Permission>
     */
    public function permissions(): array
    {
        return match ($this) {
            self::Employee => [],
            self::Admin => Permission::cases(),
        };
    }
}
