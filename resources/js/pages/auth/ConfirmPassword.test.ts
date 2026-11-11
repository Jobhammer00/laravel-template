// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ConfirmPassword from '@/pages/auth/ConfirmPassword.vue';

const passkey = vi.hoisted(() => ({
    routes: null as { options: string; submit: string } | null,
}));

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
    usePage: () => ({ props: { markerProject: null } }),
}));

vi.mock('@laravel/passkeys/vue', async () => {
    const { ref } = await import('vue');

    return {
        usePasskeyVerify: (options: { routes: typeof passkey.routes }) => {
            passkey.routes = options.routes;

            return {
                verify: vi.fn(),
                isLoading: ref(false),
                error: ref(null),
                isSupported: ref(true),
            };
        },
    };
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('auth ConfirmPassword', () => {
    it('confirms with the password', async () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        const wrapper = mount(ConfirmPassword);
        wrapper.find<HTMLInputElement>('#password').element.value = 'geheim';

        await wrapper.find('form').trigger('submit');

        expect(visit).toHaveBeenCalledWith(
            '/user/confirm-password',
            expect.objectContaining({
                method: 'post',
                data: { password: 'geheim' },
            }),
        );
    });

    it('offers confirming with a passkey instead', () => {
        const wrapper = mount(ConfirmPassword);

        expect(wrapper.text()).toContain('Bevestigen met passkey');
        expect(passkey.routes).toEqual({
            options: '/passkeys/confirm/options',
            submit: '/passkeys/confirm',
        });
    });
});
