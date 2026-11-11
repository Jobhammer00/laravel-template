// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ManagePasskeys from '@/components/ManagePasskeys.vue';
import PasskeyItem from '@/components/PasskeyItem.vue';
import PasskeyRegister from '@/components/PasskeyRegister.vue';
import type { Passkey } from '@/types';

vi.mock('@laravel/passkeys/vue', async () => {
    const { ref } = await import('vue');

    return {
        usePasskeyRegister: () => ({
            register: vi.fn(),
            isLoading: ref(false),
            error: ref(null),
            isSupported: ref(true),
        }),
    };
});

afterEach(() => {
    vi.restoreAllMocks();
});

const passkeys: Passkey[] = [
    {
        id: 7,
        name: 'MacBook',
        authenticator: null,
        created_at_diff: '2 days ago',
        last_used_at_diff: null,
    },
];

describe('ManagePasskeys', () => {
    it('is hidden for a user who cannot manage passkeys', () => {
        expect(mount(ManagePasskeys).html()).toBe('<!--v-if-->');
    });

    it('invites to add a first passkey', () => {
        const wrapper = mount(ManagePasskeys, {
            props: { canManagePasskeys: true },
        });

        expect(wrapper.text()).toContain('Nog geen passkeys');
        expect(wrapper.findComponent(PasskeyRegister).exists()).toBe(true);
    });

    it('deletes a passkey and keeps the scroll position', () => {
        const destroy = vi.spyOn(router, 'delete').mockImplementation(() => {});
        const onError = vi.fn();
        const wrapper = mount(ManagePasskeys, {
            props: { canManagePasskeys: true, passkeys },
        });

        wrapper.findComponent(PasskeyItem).vm.$emit('remove', 7, onError);

        expect(destroy).toHaveBeenCalledWith('/user/passkeys/7', {
            preserveScroll: true,
            onError,
        });
    });

    it('reloads the page after registering a passkey', () => {
        const reload = vi.spyOn(router, 'reload').mockImplementation(() => {});
        const wrapper = mount(ManagePasskeys, {
            props: { canManagePasskeys: true, passkeys },
        });

        wrapper.findComponent(PasskeyRegister).vm.$emit('success');

        expect(reload).toHaveBeenCalled();
    });
});
