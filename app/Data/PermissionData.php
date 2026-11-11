<?php

namespace App\Data;

use App\Enums\Permission;
use Spatie\LaravelData\Data;

class PermissionData extends Data
{
    public function __construct(
        public Permission $value,
        public string $label,
    ) {}

    public static function fromPermission(Permission $permission): self
    {
        return new self($permission, $permission->label());
    }
}
