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
        // groupBy, not a comparison: with one group PHPStan sees `group() === $group` as always true.
        $permissions = collect(Permission::cases())
            ->groupBy(fn (Permission $permission): string => $permission->group()->value)
            ->get($group->value, collect())
            ->map(PermissionData::fromPermission(...));

        return new self($group, $group->label(), array_values($permissions->all()));
    }
}
