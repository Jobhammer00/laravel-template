import { createInertiaApp, router } from '@inertiajs/vue3';
import { initializeTheme } from '@/composables/useAppearance';
import AppLayout from '@/layouts/AppLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { initializeFlashToast } from '@/lib/flashToast';
import { initializeSentry } from '@/lib/sentry';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case name === 'Welcome':
            case name === 'ErrorPage':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    progress: {
        color: '#10a068',
    },
    withApp: (app) => initializeSentry(app),
});

// This will set light / dark mode on page load...
initializeTheme();

// This will listen for flash toast data from the server...
initializeFlashToast();

// Back/forward restores props from history; fetch them again so edits show.
// A null state is no Inertia page, so nothing is restored then.
let restoring = false;
window.addEventListener(
    'popstate',
    (event) => (restoring = event.state !== null),
);
router.on('navigate', () => {
    if (restoring) {
        restoring = false;
        router.visit(window.location.href, {
            replace: true,
            preserveScroll: true,
        });
    }
});
