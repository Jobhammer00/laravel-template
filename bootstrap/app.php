<?php

use App\Http\Middleware\EnsureUserIsActive;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Sentry\Laravel\Integration;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // This application always runs behind a TLS-terminating proxy (Envoy on
        // the cluster, the hosting load balancer in production), so requests
        // arrive as http and Laravel would otherwise generate http URLs on an
        // https page. X-Forwarded-Host is deliberately NOT trusted: no proxy
        // in front of us strips it, and trusting it would let any caller poison
        // generated URLs such as password-reset links.
        $middleware->trustProxies(
            at: '*',
            headers: Request::HEADER_X_FORWARDED_FOR
                | Request::HEADER_X_FORWARDED_PROTO
                | Request::HEADER_X_FORWARDED_PORT,
        );

        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            EnsureUserIsActive::class,
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // Reports to Sentry when SENTRY_LARAVEL_DSN is set; a no-op without it.
        Integration::handles($exceptions);

        $json = fn (Request $request): bool => $request->is('api/*') || $request->expectsJson();

        $exceptions->shouldRenderJsonWhen($json);

        $exceptions->respond(function (Response $response, Throwable $exception, Request $request) use ($json) {
            $status = $response->getStatusCode();

            if ($json($request)) {
                return $response;
            }

            if ($status === 419) {
                Inertia::flash('toast', ['type' => 'warning', 'message' => 'De pagina was verlopen. Probeer het opnieuw.']);

                // 303 so the browser follows a PUT, PATCH or DELETE with a GET instead of resending it.
                return in_array($request->method(), ['PUT', 'PATCH', 'DELETE'], true) ? back(303) : back();
            }

            if (in_array($status, [403, 404], true) || (in_array($status, [500, 503], true) && ! config('app.debug'))) {
                // A 404 from route model binding is thrown before HandleInertiaRequests shares the user and app name.
                // Rescued: on a 500 the database may be what failed, and the page must still render.
                rescue(fn () => Inertia::share(app(HandleInertiaRequests::class)->share($request)), report: false);

                return Inertia::render('ErrorPage', ['status' => $status])
                    ->toResponse($request)
                    ->setStatusCode($status);
            }

            return $response;
        });
    })->create();
