<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Spatie\Health\Checks\Checks\CacheCheck;
use Spatie\Health\Checks\Checks\DatabaseCheck;
use Spatie\Health\Checks\Checks\HorizonCheck;
use Spatie\Health\Checks\Checks\PingCheck;
use Spatie\Health\Checks\Checks\RedisCheck;
use Spatie\Health\Checks\Checks\ScheduleCheck;
use Spatie\Health\Facades\Health;

/**
 * The checks behind /health (code14/quality-watch-health).
 *
 * The package itself registers DebugModeCheck and ErrorLoggingCheck; these are
 * the services this application cannot run without. The scheduler runs them
 * every minute (routes/console.php) and stores the results in the shared cache
 * (config/health.php), so every pod shows the same page.
 */
class HealthServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Health::checks([
            DatabaseCheck::new(),
            CacheCheck::new(),
            RedisCheck::new(),
            HorizonCheck::new(),
            // The heartbeat is set every minute; one missed beat is not yet a
            // stopped scheduler.
            ScheduleCheck::new()->heartbeatMaxAgeInMinutes(2),
            // PDF rendering (config/services.php).
            PingCheck::new()
                ->name('Gotenberg')
                ->url(rtrim(config()->string('services.gotenberg.url'), '/') . '/health')
                ->timeout(2),
        ]);
    }
}
