<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Spatie\Health\Checks\Checks\CacheCheck;
use Spatie\Health\Checks\Checks\DatabaseCheck;
use Spatie\Health\Checks\Checks\DebugModeCheck;
use Spatie\Health\Checks\Checks\EnvironmentCheck;
use Spatie\Health\Checks\Checks\HorizonCheck;
use Spatie\Health\Checks\Checks\RedisCheck;
use Spatie\Health\Checks\Checks\ScheduleCheck;
use Spatie\Health\Facades\Health;

/**
 * The checks Oh Dear reads (spatie/laravel-health, /oh-dear-health-check-results).
 *
 * Every external system and every critical process gets its own check
 * (docs/harnas/rules/health-checks.md). The scheduler runs them
 * every minute (routes/console.php) and stores the results in the shared cache
 * (config/health.php), so every pod shows the same page.
 */
class HealthServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Health::checks([
            DebugModeCheck::new(),
            EnvironmentCheck::new(),
            DatabaseCheck::new(),
            CacheCheck::new(),
            RedisCheck::new(),
            HorizonCheck::new(),
            // The heartbeat is set every minute; one missed beat is not yet a
            // stopped scheduler.
            ScheduleCheck::new()->heartbeatMaxAgeInMinutes(2),
        ]);
    }
}
