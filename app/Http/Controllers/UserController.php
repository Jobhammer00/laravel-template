<?php

namespace App\Http\Controllers;

use App\Actions\Users\DeleteUserAction;
use App\Actions\Users\InviteUserAction;
use App\Actions\Users\UpdateUserAction;
use App\Data\PermissionGroupData;
use App\Data\RoleData;
use App\Data\UserData;
use App\Enums\Permission;
use App\Enums\PermissionGroup;
use App\Enums\Role;
use App\Http\Requests\Users\UserRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        Gate::authorize('viewAny', User::class);

        return Inertia::render('users/Index', [
            'users' => UserData::collect(User::with('permissions')->orderBy('name')->get()),
            'permissionTotal' => count(Permission::cases()),
            ...$this->options(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', User::class);

        return Inertia::render('users/Edit', [
            'user' => null,
            'canDelete' => false,
            ...$this->options(),
        ]);
    }

    public function store(UserRequest $request, InviteUserAction $invite): RedirectResponse
    {
        $user = $invite->execute($request->toData());

        Inertia::flash('toast', ['type' => 'success', 'message' => $user->wasRecentlyCreated
            ? 'Gebruiker toegevoegd. Er is een uitnodiging verstuurd.'
            : 'Verwijderde gebruiker teruggezet. Er is een uitnodiging verstuurd.']);

        return to_route('users.edit', $user);
    }

    public function edit(User $user): Response
    {
        Gate::authorize('update', $user);

        return Inertia::render('users/Edit', [
            'user' => UserData::from($user),
            'canDelete' => Gate::allows('delete', $user),
            ...$this->options(),
        ]);
    }

    public function update(UserRequest $request, User $user, UpdateUserAction $update): RedirectResponse
    {
        $update->execute($user, $request->toData());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Opgeslagen.']);

        return to_route('users.edit', $user);
    }

    public function destroy(User $user, DeleteUserAction $delete): RedirectResponse
    {
        Gate::authorize('delete', $user);

        $delete->execute($user);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Gebruiker verwijderd.']);

        return to_route('users.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function options(): array
    {
        return [
            'roles' => RoleData::collect(Role::cases()),
            'permissionGroups' => array_values(array_filter(
                PermissionGroupData::collect(PermissionGroup::cases()),
                fn (PermissionGroupData $group) => $group->permissions !== [],
            )),
        ];
    }
}
