<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use Spatie\Health\Commands\RunHealthChecksCommand;
use Spatie\Health\Commands\ScheduleCheckHeartbeatCommand;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Health checks behind /health (app/Providers/HealthServiceProvider.php): run
// them and beat the heart the ScheduleCheck listens for.
Schedule::command(RunHealthChecksCommand::class)->everyMinute()->onOneServer();
Schedule::command(ScheduleCheckHeartbeatCommand::class)->everyMinute()->onOneServer();
