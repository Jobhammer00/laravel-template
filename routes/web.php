<?php

use App\Enums\Permission;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Spatie\Health\Http\Controllers\HealthCheckResultsController;

Route::inertia('/', 'Welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'Dashboard')->name('dashboard');
    Route::get('health', HealthCheckResultsController::class)->name('health');

    Route::resource('users', UserController::class)
        ->except('show')
        ->middleware('can:' . Permission::ManageUsers->value);
});

require __DIR__ . '/settings.php';
