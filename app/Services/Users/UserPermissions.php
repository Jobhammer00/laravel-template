<?php

namespace App\Services\Users;

use App\Enums\AuditArea;
use App\Enums\Permission;
use App\Models\User;

class UserPermissions
{
    /**
     * Spatie syncs the pivot without model events, so the log entry is written here.
     *
     * @param  list<Permission>  $permissions
     */
    public function sync(User $user, array $permissions): void
    {
        $before = $user->getPermissionNames();
        $after = $user->syncPermissions($permissions)->load('permissions')->getPermissionNames();

        $added = $after->diff($before)->values()->all();
        $removed = $before->diff($after)->values()->all();

        if ($added === [] && $removed === []) {
            return;
        }

        activity(AuditArea::Users)
            ->performedOn($user)
            ->event('permissions')
            ->withProperties(['added' => $added, 'removed' => $removed])
            ->log('permissions');
    }
}
