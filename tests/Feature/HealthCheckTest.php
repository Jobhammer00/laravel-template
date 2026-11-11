<?php

use Illuminate\Console\Scheduling\Event;
use Illuminate\Console\Scheduling\Schedule;
use Spatie\Health\Checks\Check;
use Spatie\Health\Checks\Checks\CacheCheck;
use Spatie\Health\Checks\Checks\DatabaseCheck;
use Spatie\Health\Checks\Checks\DebugModeCheck;
use Spatie\Health\Checks\Checks\EnvironmentCheck;
use Spatie\Health\Checks\Checks\HorizonCheck;
use Spatie\Health\Checks\Checks\RedisCheck;
use Spatie\Health\Checks\Checks\ScheduleCheck;
use Spatie\Health\Facades\Health;

test('the application checks are registered', function () {
    expect(Health::registeredChecks()->map(fn (Check $check) => $check::class))->toContain(
        DebugModeCheck::class,
        EnvironmentCheck::class,
        DatabaseCheck::class,
        CacheCheck::class,
        RedisCheck::class,
        HorizonCheck::class,
        ScheduleCheck::class,
    );
});

test('the scheduler runs the checks and beats the heart every minute', function () {
    $commands = collect(app(Schedule::class)->events())
        ->filter(fn (Event $event) => $event->expression === '* * * * *')
        ->map(fn (Event $event) => $event->command);

    expect($commands->implode(' '))
        ->toContain('health:check')
        ->toContain('health:schedule-check-heartbeat');
});

test('oh dear gets no results without the right secret', function () {
    $this->getJson('/oh-dear-health-check-results', ['oh-dear-health-check-secret' => 'wrong'])
        ->assertForbidden();
});
