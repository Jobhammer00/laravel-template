// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ErrorPage from '@/pages/ErrorPage.vue';

const auth = vi.hoisted(() => ({
    user: null as { email: string } | null,
}));

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
    usePage: () => ({ props: { auth } }),
}));

afterEach(() => {
    auth.user = null;
    vi.restoreAllMocks();
});

const mountError = (status: 403 | 404 | 500 | 503): ReturnType<typeof mount> =>
    mount(ErrorPage, {
        props: { status },
        global: {
            stubs: {
                AppLayout: {
                    template: '<main data-app-layout><slot /></main>',
                },
                AppLogo: true,
            },
        },
    });

describe('ErrorPage', () => {
    it.each([
        [404, 'Pagina niet gevonden'],
        [500, 'Er ging iets mis'],
        [503, 'Even onderhoud'],
    ] as const)(
        'explains a %i without the app shell for a guest',
        (status, title) => {
            const wrapper = mountError(status);

            expect(wrapper.find('[data-app-layout]').exists()).toBe(false);
            expect(wrapper.find('h1').text()).toBe(title);
            expect(wrapper.text()).not.toContain('Naar dashboard');
        },
    );

    it('tells a signed in user who they are signed in as on a 403', () => {
        auth.user = { email: 'piet@example.com' };
        const wrapper = mountError(403);

        expect(wrapper.find('[data-app-layout]').exists()).toBe(true);
        expect(wrapper.find('h1').text()).toBe('Geen toegang');
        expect(wrapper.text()).toContain('Ingelogd als piet@example.com.');
        expect(wrapper.find('a[href="/dashboard"]').text()).toBe(
            'Naar dashboard',
        );
    });

    it('does not name the account on other errors', () => {
        auth.user = { email: 'piet@example.com' };
        const wrapper = mountError(404);

        expect(wrapper.text()).not.toContain('Ingelogd als');
    });

    it('goes back in the browser history', async () => {
        const back = vi
            .spyOn(window.history, 'back')
            .mockImplementation(() => {});
        const wrapper = mountError(404);

        await wrapper
            .findAll('button')
            .find((button) => button.text() === '← Terug')!
            .trigger('click');

        expect(back).toHaveBeenCalledOnce();
    });

    it('goes back from inside the app shell too', async () => {
        auth.user = { email: 'piet@example.com' };
        const back = vi
            .spyOn(window.history, 'back')
            .mockImplementation(() => {});
        const wrapper = mountError(500);

        await wrapper
            .findAll('button')
            .find((button) => button.text() === '← Terug')!
            .trigger('click');

        expect(back).toHaveBeenCalledOnce();
    });
});
