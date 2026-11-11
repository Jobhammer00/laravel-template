// @vitest-environment happy-dom
import { usePage } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import AppSidebar from '@/components/AppSidebar.vue';
import { SidebarProvider } from '@/components/ui/sidebar';

vi.mock('@inertiajs/vue3', async (original) => {
    const page = (await import('vue')).reactive({
        url: '/dashboard',
        props: {
            name: 'Template',
            auth: {
                user: { id: 1, name: 'Piet Jansen', email: 'piet@example.com' },
                roleLabel: 'Medewerker',
                permissions: [] as string[],
            },
        },
    });

    return {
        ...(await original<Record<string, unknown>>()),
        usePage: () => page,
    };
});

const items = () =>
    mount(SidebarProvider, {
        slots: { default: () => h(AppSidebar, () => 'Pagina') },
    })
        .findAll('a[data-sidebar=menu-button]')
        .map((item) => item.text());

describe('AppSidebar', () => {
    it('only lists the pages the user may open', () => {
        expect(items()).toEqual(['Dashboard']);
    });

    it('lists user management for a user with that right', () => {
        usePage().props.auth.permissions = ['manage_users'];

        expect(items()).toEqual(['Dashboard', 'User beheer']);
    });
});
