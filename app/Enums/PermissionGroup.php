<?php

namespace App\Enums;

enum PermissionGroup: string
{
    case General = 'general';

    public function label(): string
    {
        return match ($this) {
            self::General => 'Algemeen',
        };
    }
}
