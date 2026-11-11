// @vitest-environment happy-dom
import { usePage } from '@inertiajs/vue3';
import { Package, Users } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import NavMain from '@/components/NavMain.vue';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { NavGroup } from '@/types';

vi.mock('@inertiajs/vue3', async (original) => {
    const page = (await import('vue')).reactive({ url: '/' });

    return {
        ...(await original<Record<string, unknown>>()),
        usePage: () => page,
    };
});

const groups: NavGroup[] = [
    {
        title: 'Algemeen',
        items: [
            { title: 'Gebruikers', href: '/users', icon: Users },
            {
                title: 'Instellingen',
                href: '/categories',
                activeFor: ['/variables'],
                icon: Package,
                alert: 3,
            },
        ],
    },
];

const activeOn = (url: string): string[] => {
    usePage().url = url;
    const wrapper = mount(SidebarProvider, {
        slots: { default: () => h(NavMain, { groups }) },
    });

    return wrapper.findAll('[data-active=true]').map((item) => item.text());
};

describe('NavMain', () => {
    it('lists the groups with links to their items', () => {
        usePage().url = '/';
        const wrapper = mount(SidebarProvider, {
            slots: { default: () => h(NavMain, { groups }) },
        });

        expect(wrapper.text()).toContain('Algemeen');
        expect(
            wrapper.findAll('a').map((link) => link.attributes('href')),
        ).toEqual(['/users', '/categories']);
    });

    it('marks the item of the current page and the pages below it active', () => {
        expect(activeOn('/users')).toEqual(['Gebruikers']);
        expect(activeOn('/users/5/edit')).toEqual(['Gebruikers']);
        expect(activeOn('/users-export')).toEqual([]);
    });

    it('marks an item active on the other pages it stands for', () => {
        expect(activeOn('/variables/2')).toEqual(['Instellingen']);
    });

    it('shows the number of problems next to an item', () => {
        usePage().url = '/';
        const wrapper = mount(SidebarProvider, {
            slots: { default: () => h(NavMain, { groups }) },
        });
        const badge = wrapper.find('[data-sidebar=menu-badge]');

        expect(badge.text()).toBe('3');
        expect(badge.attributes('title')).toBe('3 met een probleem');
    });
});
