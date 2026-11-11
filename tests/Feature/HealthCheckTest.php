<?php

use App\Models\User;
use Illuminate\Console\Scheduling\Event;
use Illuminate\Console\Scheduling\Schedule;
use Spatie\Health\Checks\Check;
use Spatie\Health\Checks\Checks\CacheCheck;
use Spatie\Health\Checks\Checks\DatabaseCheck;
use Spatie\Health\Checks\Checks\DebugModeCheck;
use Spatie\Health\Checks\Checks\HorizonCheck;
use Spatie\Health\Checks\Checks\PingCheck;
use Spatie\Health\Checks\Checks\RedisCheck;
use Spatie\Health\Checks\Checks\ScheduleCheck;
use Spatie\Health\Facades\Health;

test('the application checks are registered', function () {
    $checks = Health::registeredChecks()->map(fn (Check $check) => $check::class);

    expect($checks)->toContain(
        DebugModeCheck::class,
        DatabaseCheck::class,
        CacheCheck::class,
        RedisCheck::class,
        HorizonCheck::class,
        ScheduleCheck::class,
        PingCheck::class,
    );
});

test('the gotenberg check pings the health endpoint of the configured url', function () {
    $ping = Health::registeredChecks()->first(fn (Check $check) => $check instanceof PingCheck);

    expect($ping->getName())->toBe('Gotenberg')
        ->and((fn () => $this->url)->call($ping))->toBe(rtrim(config('services.gotenberg.url'), '/') . '/health');
});

test('the scheduler runs the checks and beats the heart every minute', function () {
    $commands = collect(app(Schedule::class)->events())
        ->filter(fn (Event $event) => $event->expression === '* * * * *')
        ->map(fn (Event $event) => $event->command);

    expect($commands->implode(' '))
        ->toContain('health:check')
        ->toContain('health:schedule-check-heartbeat');
});

test('the health page sends a guest to the login', function () {
    $this->get('/health')->assertRedirect(route('login'));
});

test('the health page is open to a signed-in user', function () {
    $this->actingAs(User::factory()->create())
        ->get('/health')
        ->assertOk();
});
