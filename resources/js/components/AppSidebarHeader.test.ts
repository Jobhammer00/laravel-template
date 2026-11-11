// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import AppSidebarHeader from '@/components/AppSidebarHeader.vue';
import { SidebarProvider } from '@/components/ui/sidebar';
import type { BreadcrumbItem } from '@/types';

const header = (breadcrumbs?: BreadcrumbItem[]) =>
    mount(SidebarProvider, {
        slots: {
            default: () => h(AppSidebarHeader, { breadcrumbs }),
        },
    }).find('header');

describe('AppSidebarHeader', () => {
    it('links back to the page one level up', () => {
        const wrapper = header([
            { title: 'Producten', href: '/products' },
            { title: 'Rolluik', href: '/products/1' },
            { title: 'Bewerken', href: '/products/1/edit' },
        ]);

        expect(wrapper.find('a[aria-label=Terug]').attributes('href')).toBe(
            '/products/1',
        );
        expect(wrapper.text()).toContain('Bewerken');
    });

    it('has no back link for a top level page', () => {
        const wrapper = header([{ title: 'Producten', href: '/products' }]);

        expect(wrapper.find('[aria-label=Terug]').exists()).toBe(false);
        expect(wrapper.text()).toContain('Producten');
        expect(wrapper.classes()).not.toContain('md:hidden');
    });

    it('hides on desktop without breadcrumbs', () => {
        expect(header().classes()).toContain('md:hidden');
    });
});
