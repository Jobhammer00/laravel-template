<?php

use Illuminate\Console\Scheduling\Event;
use Illuminate\Console\Scheduling\Schedule;
use Spatie\Health\Checks\Check;
use Spatie\Health\Checks\Checks\CacheCheck;
use Spatie\Health\Checks\Checks\DatabaseCheck;
use Spatie\Health\Checks\Checks\HorizonCheck;
use Spatie\Health\Checks\Checks\PingCheck;
use Spatie\Health\Checks\Checks\RedisCheck;
use Spatie\Health\Checks\Checks\ScheduleCheck;
use Spatie\Health\Facades\Health;

test('the application checks are registered next to the ones of the package', function () {
    $checks = Health::registeredChecks()->map(fn (Check $check) => $check::class);

    expect($checks)->toContain(
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

test('the health page is closed to an address outside the allow list', function () {
    $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])
        ->get('/health')
        ->assertForbidden();
});

test('the health page is open to an address on the allow list', function () {
    config(['quality-watch-health.allowed_ips' => ['203.0.113.10']]);

    $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.10'])
        ->get('/health')
        ->assertOk();
});
