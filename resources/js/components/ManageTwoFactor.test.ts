// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ManageTwoFactor from '@/components/ManageTwoFactor.vue';
import TwoFactorSetupModal from '@/components/TwoFactorSetupModal.vue';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    useHttp: () => ({
        submit: vi.fn(async ({ url }: { url: string }) => {
            if (url.endsWith('recovery-codes')) {
                return ['code-one'];
            }

            return url.endsWith('qr-code')
                ? { svg: '<svg></svg>', url: 'otpauth://' }
                : { secretKey: 'SECRET-KEY' };
        }),
    }),
}));

beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => null });
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
});

afterEach(() => {
    useTwoFactorAuth().clearTwoFactorAuthData();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
});

const manage = (twoFactorEnabled: boolean) =>
    mount(ManageTwoFactor, {
        props: { canManageTwoFactor: true, twoFactorEnabled },
        attachTo: document.body,
    });

const modalOpen = (wrapper: ReturnType<typeof manage>): boolean =>
    wrapper.findComponent(TwoFactorSetupModal).props('isOpen') as boolean;

describe('ManageTwoFactor', () => {
    it('is hidden for a user who cannot manage two-factor', () => {
        expect(mount(ManageTwoFactor).html()).toBe('<!--v-if-->');
    });

    it('turns two-factor on and opens the setup', async () => {
        const visit = vi
            .spyOn(router, 'visit')
            .mockImplementation((_url, options) =>
                options?.onSuccess?.({ props: {} } as never),
            );
        const wrapper = manage(false);

        expect(wrapper.text()).toContain('Uit');

        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(visit).toHaveBeenCalledWith(
            '/user/two-factor-authentication',
            expect.objectContaining({ method: 'post' }),
        );
        expect(modalOpen(wrapper)).toBe(true);
        wrapper.unmount();
    });

    it('lets an unfinished setup be finished', async () => {
        await useTwoFactorAuth().fetchSetupData();
        const wrapper = manage(false);

        const finish = wrapper
            .findAll('button')
            .find((button) => button.text() === 'Instellen afronden')!;
        await finish.trigger('click');

        expect(modalOpen(wrapper)).toBe(true);
        wrapper.unmount();
    });

    it('turns two-factor off and shows the recovery codes while on', async () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        const wrapper = manage(true);
        await flushPromises();

        expect(wrapper.text()).toContain('Aan');
        expect(wrapper.text()).toContain('2FA recovery codes');

        await wrapper.find('form').trigger('submit');

        expect(visit).toHaveBeenCalledWith(
            '/user/two-factor-authentication?_method=DELETE',
            expect.objectContaining({ method: 'post' }),
        );
        wrapper.unmount();
    });

    it('forgets the two-factor data when leaving the page', async () => {
        await useTwoFactorAuth().fetchSetupData();
        const wrapper = manage(false);

        wrapper.unmount();

        expect(useTwoFactorAuth().hasSetupData.value).toBe(false);
    });
});
