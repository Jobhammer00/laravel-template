<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Laravel\Horizon\HorizonApplicationServiceProvider;

/**
 * Who may open the Horizon dashboard.
 *
 * Horizon shows the payload of every queued job, so it is not a page to leave
 * open. Locally everyone may look; everywhere else — acceptance, production
 * and Feature Previews — only a logged-in user whose address is listed in
 * `horizon.admins` (HORIZON_ADMINS, comma separated).
 *
 * An empty list lets nobody in, and that is deliberate: a forgotten setting
 * must close the door, not open it. Feature Previews leave it empty on
 * purpose — their login password is printed in the merge request comment.
 *
 * Replace the address list with a role check once the application has roles.
 */
class HorizonServiceProvider extends HorizonApplicationServiceProvider
{
    protected function gate(): void
    {
        Gate::define('viewHorizon', function (?User $user = null): bool {
            if ($this->app->environment('local')) {
                return true;
            }

            /** @var list<string> $admins */
            $admins = config('horizon.admins', []);

            return $user instanceof User && in_array($user->email, $admins, true);
        });
    }
}
