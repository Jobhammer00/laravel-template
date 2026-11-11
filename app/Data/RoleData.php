<?php

namespace App\Data;

use App\Enums\Permission;
use App\Enums\Role;
use Spatie\LaravelData\Data;

class RoleData extends Data
{
    /**
     * @param  list<Permission>  $permissions
     */
    public function __construct(
        public Role $value,
        public string $label,
        public string $tag,
        public array $permissions,
    ) {}

    public static function fromRole(Role $role): self
    {
        return new self($role, $role->label(), $role->tag(), $role->permissions());
    }
}
