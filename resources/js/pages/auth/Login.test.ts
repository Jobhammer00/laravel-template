// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Login from '@/pages/auth/Login.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
    usePage: () => ({ props: { markerProject: null } }),
}));

vi.mock('@laravel/passkeys/vue', async () => {
    const { ref } = await import('vue');

    return {
        usePasskeyVerify: () => ({
            verify: vi.fn(),
            isLoading: ref(false),
            error: ref(null),
            isSupported: ref(true),
        }),
    };
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('Login', () => {
    it('logs in with the e-mail address and password', async () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        const wrapper = mount(Login, { props: { canResetPassword: true } });
        wrapper.find<HTMLInputElement>('#email').element.value =
            'piet@example.com';
        wrapper.find<HTMLInputElement>('#password').element.value = 'geheim';

        await wrapper.find('form').trigger('submit');

        expect(visit).toHaveBeenCalledWith(
            '/login',
            expect.objectContaining({
                method: 'post',
                data: { email: 'piet@example.com', password: 'geheim' },
            }),
        );
    });

    it('offers signing in with a passkey and resetting the password', () => {
        const wrapper = mount(Login, { props: { canResetPassword: true } });

        expect(wrapper.text()).toContain('Inloggen met een passkey');
        expect(wrapper.find('a[href="/forgot-password"]').text()).toBe(
            'Wachtwoord vergeten?',
        );
    });

    it('shows the status and hides the reset link when resetting is off', () => {
        const wrapper = mount(Login, {
            props: {
                canResetPassword: false,
                status: 'Je wachtwoord is gewijzigd.',
            },
        });

        expect(wrapper.text()).toContain('Je wachtwoord is gewijzigd.');
        expect(wrapper.find('a[href="/forgot-password"]').exists()).toBe(false);
    });
});
