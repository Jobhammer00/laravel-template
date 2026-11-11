// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Layout from '@/layouts/settings/Layout.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    usePage: () => ({ url: '/settings/security/confirm' }),
}));

describe('settings Layout', () => {
    it('links the settings pages and marks the current section', () => {
        const wrapper = mount(Layout, {
            slots: { default: '<p>Instellingen</p>' },
        });
        const links = wrapper.findAll('nav a');

        expect(links.map((link) => link.attributes('href'))).toEqual([
            '/settings/profile',
            '/settings/security',
            '/settings/appearance',
        ]);
        expect(
            links.map((link) => link.attributes('aria-current') ?? null),
        ).toEqual([null, 'page', null]);
        expect(wrapper.find('p').text()).toBe('Instellingen');
    });
});
