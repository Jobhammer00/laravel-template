<?php

namespace App\Policies;

use App\Enums\Permission;
use App\Models\User;

class UserPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo(Permission::ManageUsers);
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo(Permission::ManageUsers);
    }

    public function update(User $user, User $target): bool
    {
        return $user->hasPermissionTo(Permission::ManageUsers);
    }

    public function delete(User $user, User $target): bool
    {
        return $user->hasPermissionTo(Permission::ManageUsers) && $user->isNot($target);
    }
}
