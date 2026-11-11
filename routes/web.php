<?php

use App\Enums\Permission;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'Welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');

    Route::resource('users', UserController::class)
        ->except('show')
        ->middleware('can:' . Permission::ManageUsers->value);
});

require __DIR__ . '/settings.php';
