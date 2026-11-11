<?php

use App\Enums\Permission;
use Database\Seeders\PermissionSeeder;
use Spatie\Permission\Models\Permission as SpatiePermission;

test('the permission seeder creates every right once, however often it runs', function () {
    SpatiePermission::query()->delete();

    $this->seed(PermissionSeeder::class);
    $this->seed(PermissionSeeder::class);

    expect(SpatiePermission::pluck('name')->sort()->values()->all())
        ->toBe(collect(Permission::cases())->pluck('value')->sort()->values()->all());
});

test('the permission seeder never removes a right that is not in the enum', function () {
    SpatiePermission::findOrCreate('removed_right', 'web');

    $this->seed(PermissionSeeder::class);

    expect(SpatiePermission::where('name', 'removed_right')->exists())->toBeTrue();
});
