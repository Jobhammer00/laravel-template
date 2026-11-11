<?php

namespace App\Actions\Users;

use App\Data\UserInputData;
use App\Models\User;
use App\Services\Users\UserPermissions;

class UpdateUserAction
{
    public function __construct(private UserPermissions $permissions) {}

    public function execute(User $user, UserInputData $data): void
    {
        $user->update($data->attributes());
        $this->permissions->sync($user, $data->permissions);
    }
}
