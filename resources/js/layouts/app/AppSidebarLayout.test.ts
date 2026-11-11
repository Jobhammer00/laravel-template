// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import AppSidebarLayout from '@/layouts/app/AppSidebarLayout.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    usePage: () => ({
        url: '/products',
        props: {
            name: 'Laravel',
            sidebarOpen: true,
            auth: {
                user: { id: 1, name: 'Piet Jansen' },
                roleLabel: 'Admin',
                permissions: ['view_products'],
            },
        },
    }),
}));

describe('AppSidebarLayout', () => {
    it('shows the page next to the sidebar, under its breadcrumbs', () => {
        const wrapper = mount(AppSidebarLayout, {
            props: { breadcrumbs: [{ title: 'Producten', href: '/products' }] },
            slots: { default: '<p>Inhoud</p>' },
        });

        expect(wrapper.find('[data-slot=sidebar-wrapper]').text()).toContain(
            'Producten',
        );
        expect(
            wrapper
                .find('[data-slot=sidebar-inset] header [data-slot=breadcrumb]')
                .text(),
        ).toBe('Producten');
        expect(wrapper.find('[data-slot=sidebar-inset] p').text()).toBe(
            'Inhoud',
        );
    });
});
