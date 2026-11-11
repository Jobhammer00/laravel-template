<?php

namespace App\Actions\Users;

use App\Data\UserInputData;
use App\Models\User;
use App\Notifications\UserInvitation;
use App\Services\Users\UserPermissions;
use Illuminate\Support\Str;

class InviteUserAction
{
    public function __construct(private UserPermissions $permissions) {}

    public function execute(UserInputData $data): User
    {
        $user = User::onlyTrashed()->firstWhere('email', $data->email);
        $user?->restore();

        $user ??= new User;
        $user->fill($data->attributes());
        $user->forceFill([
            'password' => Str::password(),
            'remember_token' => null,
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_confirmed_at' => null,
        ])->save();

        $user->passkeys()->delete();
        $user->endSessions();
        $this->permissions->sync($user, $data->permissions);

        $user->notify(new UserInvitation);

        return $user;
    }
}
