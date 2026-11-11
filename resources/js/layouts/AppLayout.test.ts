// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import AppLayout from '@/layouts/AppLayout.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    usePage: () => ({
        url: '/products/1',
        props: {
            name: 'Laravel',
            sidebarOpen: true,
            auth: {
                user: { id: 1, name: 'Piet Jansen' },
                roleLabel: 'Admin',
                permissions: [],
            },
        },
    }),
}));

describe('AppLayout', () => {
    it('shows the page in the sidebar layout with a way back', () => {
        const wrapper = mount(AppLayout, {
            props: {
                breadcrumbs: [
                    { title: 'Producten', href: '/products' },
                    { title: 'Rolluik', href: '/products/1' },
                ],
            },
            slots: { default: '<p>Inhoud</p>' },
        });

        expect(wrapper.find('a[aria-label=Terug]').attributes('href')).toBe(
            '/products',
        );
        expect(wrapper.find('[data-slot=sidebar-inset] p').text()).toBe(
            'Inhoud',
        );
    });
});
