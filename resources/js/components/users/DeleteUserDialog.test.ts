// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DeleteUserDialog from '@/components/users/DeleteUserDialog.vue';
import { destroy } from '@/routes/users';

afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
});

const confirmButton = () =>
    [...document.querySelectorAll('button')].find(
        (button) => button.textContent?.trim() === 'Verwijderen',
    )!;

describe('DeleteUserDialog', () => {
    it('deletes the user after confirming', async () => {
        const remove = vi.spyOn(router, 'delete').mockImplementation(() => {});
        const wrapper = mount(DeleteUserDialog, {
            attachTo: document.body,
            props: { user: { id: 7, name: 'Piet' }, open: true },
        });
        await flushPromises();

        expect(document.body.textContent).toContain('Piet verwijderen?');

        confirmButton().click();
        await flushPromises();

        expect(remove).toHaveBeenCalledWith(destroy.url(7), {
            preserveScroll: true,
        });
        expect(wrapper.emitted('update:open')).toEqual([[false]]);

        wrapper.unmount();
    });
});
