// @vitest-environment happy-dom
import { usePage } from '@inertiajs/vue3';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AppHeader from '@/components/AppHeader.vue';

vi.mock('@inertiajs/vue3', async (original) => {
    const page = (await import('vue')).reactive({
        url: '/dashboard',
        props: {
            name: 'Laravel',
            auth: {
                user: {
                    id: 1,
                    name: 'Piet Jansen',
                    email: 'piet@example.com',
                    avatar: undefined as string | undefined,
                },
            },
        },
    });

    return {
        ...(await original<Record<string, unknown>>()),
        usePage: () => page,
    };
});

afterEach(() => {
    usePage().url = '/dashboard';
    document.body.innerHTML = '';
});

const header = (breadcrumbs = [{ title: 'Dashboard', href: '/dashboard' }]) =>
    mount(AppHeader, { props: { breadcrumbs }, attachTo: document.body });

describe('AppHeader', () => {
    it('underlines the menu item of the current page', () => {
        const active = header();
        expect(active.find('.translate-y-px').exists()).toBe(true);
        active.unmount();

        usePage().url = '/users';
        const inactive = header();
        expect(inactive.find('.translate-y-px').exists()).toBe(false);
        inactive.unmount();
    });

    it('shows the breadcrumbs only below a top level page', () => {
        const top = header();
        expect(top.find('nav[aria-label=breadcrumb]').exists()).toBe(false);
        top.unmount();

        const nested = header([
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Rapport', href: '/dashboard/report' },
        ]);
        expect(nested.find('nav[aria-label=breadcrumb]').text()).toContain(
            'Rapport',
        );
        nested.unmount();
    });

    it('shows the initials of the user and opens the user menu', async () => {
        const wrapper = header();
        const trigger = wrapper.find('[data-slot=dropdown-menu-trigger]');

        expect(trigger.text()).toBe('PJ');

        await trigger.trigger('keydown', { key: 'Enter' });
        await flushPromises();

        expect(document.body.textContent).toContain('piet@example.com');
        wrapper.unmount();
    });

    it('opens the mobile menu with the pages and external links', async () => {
        const wrapper = header();

        await wrapper.find('[data-slot=sheet-trigger]').trigger('click');
        await flushPromises();

        const sheet = document.querySelector('[data-slot=sheet-content]')!;
        expect(
            sheet.querySelector('a[href="/dashboard"]')?.className,
        ).toContain('text-neutral-900');
        expect(
            [...sheet.querySelectorAll('a[target=_blank]')].map((link) =>
                link.getAttribute('href'),
            ),
        ).toEqual([
            'https://github.com/laravel/vue-starter-kit',
            'https://laravel.com/docs/starter-kits#vue',
        ]);
        wrapper.unmount();
    });
});
