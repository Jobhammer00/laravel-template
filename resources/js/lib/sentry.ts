import * as Sentry from '@sentry/vue';
import type { App } from 'vue';

function meta(name: string): string | undefined {
    return (
        document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`)
            ?.content || undefined
    );
}

// The DSN comes from the server (app.blade.php), not from a VITE_ variable:
// one image is built for every environment, so it cannot be baked in at build
// time. Without a DSN — locally, in tests — Sentry stays off.
export function initializeSentry(app: App): void {
    const dsn = meta('sentry-dsn');

    if (!dsn) {
        return;
    }

    Sentry.init({
        app,
        dsn,
        environment: meta('sentry-environment'),
        release: meta('sentry-release'),
    });
}
