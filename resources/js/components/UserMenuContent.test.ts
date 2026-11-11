// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import {
    DropdownMenu,
    DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import UserMenuContent from '@/components/UserMenuContent.vue';
import type { User } from '@/types';

afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
});

const user = { id: 1, name: 'Piet Jansen', email: 'piet@example.com' } as User;

const menu = async () => {
    const wrapper = mount(DropdownMenu, {
        props: { open: true },
        slots: {
            default: () =>
                h(DropdownMenuContent, () => h(UserMenuContent, { user })),
        },
        attachTo: document.body,
    });
    await flushPromises();

    return wrapper;
};

describe('UserMenuContent', () => {
    it('shows who is logged in with a link to the settings', async () => {
        const wrapper = await menu();

        expect(document.body.textContent).toContain('Piet Jansen');
        expect(document.body.textContent).toContain('piet@example.com');
        expect(
            document.querySelector('a[href="/settings/profile"]')?.textContent,
        ).toContain('Instellingen');
        wrapper.unmount();
    });

    it('logs out and forgets the cached pages', async () => {
        const flushAll = vi.spyOn(router, 'flushAll');
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        const wrapper = await menu();

        document
            .querySelector<HTMLButtonElement>('[data-test=logout-button]')!
            .click();

        expect(flushAll).toHaveBeenCalled();
        expect(visit).toHaveBeenCalledWith(
            '/logout',
            expect.objectContaining({ method: 'post' }),
        );
        wrapper.unmount();
    });
});
