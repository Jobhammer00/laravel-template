// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Welcome from '@/pages/Welcome.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
}));

const mountWelcome = (user: object | null): ReturnType<typeof mount> =>
    mount(Welcome, {
        global: { mocks: { $page: { props: { auth: { user } } } } },
    });

describe('Welcome', () => {
    it('sends a signed in user to the dashboard', () => {
        const nav = mountWelcome({ id: 1 }).find('nav');

        expect(nav.find('a').attributes('href')).toBe('/dashboard');
        expect(nav.text()).not.toContain('Log in');
    });

    it('offers a guest to log in', () => {
        const nav = mountWelcome(null).find('nav');

        expect(nav.find('a').attributes('href')).toBe('/login');
        expect(nav.text()).toContain('Log in');
    });
});
