<?php

namespace App\Data;

use App\Enums\Permission;
use App\Enums\PermissionGroup;
use Spatie\LaravelData\Data;

class PermissionGroupData extends Data
{
    /**
     * @param  list<PermissionData>  $permissions
     */
    public function __construct(
        public PermissionGroup $value,
        public string $label,
        public array $permissions,
    ) {}

    public static function fromGroup(PermissionGroup $group): self
    {
        $permissions = array_values(array_map(
            PermissionData::fromPermission(...),
            array_filter(Permission::cases(), fn (Permission $permission): bool => $permission->group() === $group),
        ));

        return new self($group, $group->label(), $permissions);
    }
}
