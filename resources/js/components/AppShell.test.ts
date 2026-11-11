// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import AppShell from '@/components/AppShell.vue';
import { useSidebar } from '@/components/ui/sidebar';

const props = vi.hoisted(() => ({ sidebarOpen: false }));

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    usePage: () => ({ props }),
}));

const SidebarState = defineComponent({
    setup() {
        const { state } = useSidebar();

        return () => h('span', state.value);
    },
});

describe('AppShell', () => {
    it('opens the sidebar as the user last left it', () => {
        props.sidebarOpen = false;
        const closed = mount(AppShell, { slots: { default: SidebarState } });
        props.sidebarOpen = true;
        const open = mount(AppShell, { slots: { default: SidebarState } });

        expect(closed.text()).toBe('collapsed');
        expect(open.text()).toBe('expanded');
    });

    it('renders a plain column without sidebar for the header variant', () => {
        const wrapper = mount(AppShell, {
            props: { variant: 'header' },
            slots: { default: 'Inhoud' },
        });

        expect(wrapper.find('[data-slot=sidebar-wrapper]').exists()).toBe(
            false,
        );
        expect(wrapper.classes()).toContain('flex-col');
        expect(wrapper.text()).toBe('Inhoud');
    });
});
