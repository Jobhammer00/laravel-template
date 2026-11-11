// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import AppHeaderLayout from '@/layouts/app/AppHeaderLayout.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    usePage: () => ({
        url: '/dashboard',
        props: {
            name: 'Laravel',
            auth: { user: { id: 1, name: 'Piet Jansen' } },
        },
    }),
}));

describe('AppHeaderLayout', () => {
    it('shows the page under the header with its breadcrumbs', () => {
        const wrapper = mount(AppHeaderLayout, {
            props: {
                breadcrumbs: [
                    { title: 'Dashboard', href: '/dashboard' },
                    { title: 'Rapport', href: '/dashboard/report' },
                ],
            },
            slots: { default: '<p>Inhoud</p>' },
        });

        expect(wrapper.find('nav[aria-label=breadcrumb]').text()).toContain(
            'Rapport',
        );
        expect(wrapper.find('main p').text()).toBe('Inhoud');
    });
});
