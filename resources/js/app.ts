import { createInertiaApp, router } from '@inertiajs/vue3';
import { I18n, i18nVue } from 'laravel-vue-i18n';
import { initializeTheme } from '@/composables/useAppearance';
import AppLayout from '@/layouts/AppLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { initializeFlashToast } from '@/lib/flashToast';
import { initializeSentry } from '@/lib/sentry';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

const translations = import.meta.glob<Record<string, string>>(
    '../../lang/*.json',
    { eager: true, import: 'default' },
);

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
    // The texts come from lang/nl/*.php (the Vite plugin turns them into lang/php_nl.json). Eager and loaded at once,
    // so trans() in a script setup has them on the first render.
    withApp: (app) => {
        initializeSentry(app);
        app.use(i18nVue, {
            lang: 'nl',
            resolve: (lang: string) =>
                translations[`../../lang/php_${lang}.json`],
        });
        I18n.getSharedInstance().loadLanguage('nl');
    },
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
