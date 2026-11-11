<?php

use App\Models\User;
use Illuminate\Session\TokenMismatchException;
use Illuminate\Support\Facades\Route;
use Inertia\Testing\AssertableInertia as Assert;

test('a page without the right shows the error page inside the app, with status 403', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('users.index'))
        ->assertForbidden()
        ->assertInertia(fn (Assert $page) => $page
            ->component('ErrorPage')
            ->where('status', 403)
            ->where('auth.user.email', fn ($email) => $email !== null),
        );
});

test('an unknown page shows the error page with status 404', function () {
    $this->get('/bestaat-niet')
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page->component('ErrorPage')->where('status', 404));
});

test('a missing record shows the error page inside the app', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('users.edit', 999999))
        ->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('ErrorPage')
            ->where('auth.user.email', fn ($email) => $email !== null)
            ->has('name'),
        );
});

test('a server error shows the error page only with debug off', function () {
    Route::get('/kapot', fn () => throw new RuntimeException('kapot'))->middleware('web');

    config(['app.debug' => false]);
    $this->get('/kapot')
        ->assertStatus(500)
        ->assertInertia(fn (Assert $page) => $page->component('ErrorPage')->where('status', 500));

    config(['app.debug' => true]);
    $this->get('/kapot')->assertStatus(500)->assertDontSee('"component":"ErrorPage"', false);
});

test('a json request keeps a json error', function () {
    $this->actingAs(User::factory()->create())
        ->getJson(route('users.index'))
        ->assertForbidden()
        ->assertJsonStructure(['message']);
});

test('an expired page sends PUT, PATCH and DELETE back with a 303, so the browser does not resend them', function (string $method, int $status) {
    Route::match(['PUT', 'PATCH', 'DELETE', 'POST'], '/verlopen', fn () => throw new TokenMismatchException)->middleware('web');

    $this->from('/vorige')
        ->call($method, '/verlopen')
        ->assertStatus($status)
        ->assertRedirect('/vorige');
})->with([
    'PUT' => ['PUT', 303],
    'PATCH' => ['PATCH', 303],
    'DELETE' => ['DELETE', 303],
    'POST' => ['POST', 302],
]);

test('an api error stays json without a json accept header', function () {
    Route::get('/api/kapot', fn () => abort(404))->middleware('web');

    $this->get('/api/kapot')->assertNotFound()->assertJsonStructure(['message']);
});
