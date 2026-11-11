<?php

use App\Enums\Permission;
use App\Enums\Role;

test('admin has every right, including ones added later', function () {
    expect(Role::Admin->permissions())->toBe(Permission::cases());
});

test('every right belongs to a group', function (Permission $permission) {
    expect($permission->group()->label())->not->toBeEmpty();
})->with(Permission::cases());
