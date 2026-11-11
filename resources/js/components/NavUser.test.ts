// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import NavUser from '@/components/NavUser.vue';
import { SidebarProvider } from '@/components/ui/sidebar';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    usePage: () => ({
        props: {
            auth: {
                user: { id: 1, name: 'Piet Jansen', email: 'piet@example.com' },
                roleLabel: 'Admin',
            },
        },
    }),
}));

afterEach(() => {
    document.body.innerHTML = '';
});

describe('NavUser', () => {
    it('shows the user with their role and opens the user menu', async () => {
        const wrapper = mount(SidebarProvider, {
            slots: { default: () => h(NavUser) },
            attachTo: document.body,
        });
        const button = wrapper.find('[data-test=sidebar-menu-button]');

        expect(button.text()).toContain('Piet Jansen');
        expect(button.text()).toContain('Admin');

        await button.trigger('keydown', { key: 'Enter' });
        await flushPromises();

        expect(document.body.textContent).toContain('piet@example.com');
        expect(
            document.querySelector('[data-test=logout-button]'),
        ).not.toBeNull();
        wrapper.unmount();
    });
});
