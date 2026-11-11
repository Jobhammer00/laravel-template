<?php

namespace App\Enums;

/**
 * The values are activity log names: never rename one.
 */
enum AuditArea: string
{
    case Users = 'users';

    public function label(): string
    {
        return match ($this) {
            self::Users => 'Gebruikers',
        };
    }

    public function badge(): string
    {
        return match ($this) {
            self::Users => 'destructive',
        };
    }
}
