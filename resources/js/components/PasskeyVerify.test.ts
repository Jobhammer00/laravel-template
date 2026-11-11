// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Ref } from 'vue';
import PasskeyVerify from '@/components/PasskeyVerify.vue';

type VerifyOptions = {
    routes?: { options: string; submit: string };
    onSuccess: (response: { redirect?: string }) => void;
};

const passkey = vi.hoisted(() => ({
    options: null as VerifyOptions | null,
    verify: vi.fn(),
    isLoading: null as never as Ref<boolean>,
    error: null as never as Ref<string | null>,
    isSupported: null as never as Ref<boolean>,
}));

vi.mock('@laravel/passkeys/vue', async () => {
    const { ref } = await import('vue');
    passkey.isLoading = ref(false);
    passkey.error = ref(null);
    passkey.isSupported = ref(true);

    return {
        usePasskeyVerify: (options: VerifyOptions) => {
            passkey.options = options;

            return passkey;
        },
    };
});

afterEach(() => {
    vi.restoreAllMocks();
    passkey.verify.mockReset();
    passkey.isLoading.value = false;
    passkey.error.value = null;
    passkey.isSupported.value = true;
});

describe('PasskeyVerify', () => {
    it('signs in with a passkey on click', async () => {
        const wrapper = mount(PasskeyVerify);

        await wrapper.find('button').trigger('click');

        expect(passkey.verify).toHaveBeenCalled();
        expect(passkey.options?.routes).toBeUndefined();
        expect(wrapper.text()).toContain('Inloggen met een passkey');
        expect(wrapper.text()).toContain('Of log in met je e-mailadres');
    });

    it('verifies against the given routes with the given texts', async () => {
        const wrapper = mount(PasskeyVerify, {
            props: {
                routes: {
                    options: {
                        url: '/passkeys/confirm/options',
                        method: 'get',
                    },
                    submit: { url: '/passkeys/confirm', method: 'post' },
                },
                label: 'Bevestigen met passkey',
                loadingLabel: 'Bevestigen…',
                separator: 'Of met je wachtwoord',
            },
        });

        expect(passkey.options?.routes).toEqual({
            options: '/passkeys/confirm/options',
            submit: '/passkeys/confirm',
        });
        expect(wrapper.text()).toContain('Bevestigen met passkey');
        expect(wrapper.text()).toContain('Of met je wachtwoord');

        passkey.isLoading.value = true;
        await wrapper.vm.$nextTick();

        expect(wrapper.find('button').text()).toBe('Bevestigen…');
        expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    });

    it('shows why verifying failed', async () => {
        const wrapper = mount(PasskeyVerify);

        passkey.error.value = 'Passkey niet herkend';
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).toContain('Passkey niet herkend');
    });

    it('goes to the page the server sends, or the dashboard', () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        mount(PasskeyVerify);

        passkey.options!.onSuccess({ redirect: '/products' });
        passkey.options!.onSuccess({});

        expect(visit.mock.calls.map(([url]) => url)).toEqual([
            '/products',
            '/dashboard',
        ]);
    });

    it('shows nothing in a browser without passkeys', () => {
        passkey.isSupported.value = false;

        expect(mount(PasskeyVerify).find('button').exists()).toBe(false);
    });
});
