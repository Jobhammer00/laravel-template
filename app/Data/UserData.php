<?php

namespace App\Data;

use App\Enums\Permission;
use App\Enums\Role;
use App\Models\User;
use Spatie\LaravelData\Data;

class UserData extends Data
{
    /**
     * @param  list<Permission>  $permissions
     */
    public function __construct(
        public int $id,
        public string $name,
        public string $email,
        public Role $role,
        public bool $is_active,
        public array $permissions,
    ) {}

    public static function fromModel(User $user): self
    {
        return new self(
            id: $user->id,
            name: $user->name,
            email: $user->email,
            role: $user->role,
            is_active: $user->is_active,
            permissions: array_values(array_filter(array_map(
                Permission::tryFrom(...),
                $user->getPermissionNames()->all(),
            ))),
        );
    }
}
