// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import type { VueWrapper } from '@vue/test-utils';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TwoFactorSetupModal from '@/components/TwoFactorSetupModal.vue';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';

// happy-dom's FormData has no toStringTag, so Vue wraps the Form defaults in a proxy that breaks on its private fields.
Object.defineProperty(FormData.prototype, Symbol.toStringTag, {
    value: 'FormData',
});

const server = vi.hoisted(() => ({ fail: false, dark: false }));
const copy = vi.hoisted(() => vi.fn());

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    useHttp: () => ({
        submit: vi.fn(async ({ url }: { url: string }) => {
            if (server.fail) {
                throw new Error('500');
            }

            return url.endsWith('qr-code')
                ? { svg: '<svg id="qr"></svg>', url: 'otpauth://' }
                : { secretKey: 'SECRET-KEY' };
        }),
    }),
}));

vi.mock('@vueuse/core', async (original) => {
    const { ref } = await import('vue');

    return {
        ...(await original<Record<string, unknown>>()),
        useClipboard: () => ({ copy, copied: ref(false) }),
    };
});

beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => null });
    vi.stubGlobal('matchMedia', () => ({ matches: server.dark }));
});

afterEach(() => {
    useTwoFactorAuth().clearTwoFactorAuthData();
    server.fail = false;
    server.dark = false;
    copy.mockReset();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    document.body.innerHTML = '';
});

const modal = async (
    props: { requiresConfirmation?: boolean; twoFactorEnabled?: boolean } = {},
) => {
    const wrapper: VueWrapper<InstanceType<typeof TwoFactorSetupModal>> = mount(
        TwoFactorSetupModal,
        {
            props: {
                requiresConfirmation: false,
                twoFactorEnabled: false,
                isOpen: false,
                'onUpdate:isOpen': (isOpen?: boolean) => {
                    void wrapper.setProps({ isOpen });
                },
                ...props,
            },
            attachTo: document.body,
        },
    );
    await wrapper.setProps({ isOpen: true });
    await flushPromises();

    return wrapper;
};

const button = (text: string): HTMLButtonElement =>
    [...document.querySelectorAll('button')].find(
        (element) => element.textContent?.trim() === text,
    )!;

describe('TwoFactorSetupModal', () => {
    it('shows the QR code and the setup key to copy', async () => {
        const wrapper = await modal();

        expect(document.body.textContent).toContain(
            'Enable two-factor authentication',
        );
        expect(document.querySelector('#qr')).not.toBeNull();
        expect(
            document.querySelector<HTMLInputElement>('input[readonly]')?.value,
        ).toBe('SECRET-KEY');

        document.querySelector<HTMLButtonElement>('.border-l')!.click();

        expect(copy).toHaveBeenCalledWith('SECRET-KEY');
        wrapper.unmount();
    });

    it('inverts the QR code in dark mode so it stays scannable', async () => {
        server.dark = true;
        const wrapper = await modal();

        expect(
            document.querySelector<HTMLElement>('#qr')!.parentElement!.style
                .filter,
        ).toBe('invert(1) brightness(1.5)');
        wrapper.unmount();
    });

    it('shows why the setup could not be loaded', async () => {
        server.fail = true;
        const wrapper = await modal();

        expect(document.body.textContent).toContain('Failed to fetch QR code');
        wrapper.unmount();
    });

    it('closes on continue when no confirmation is needed', async () => {
        const wrapper = await modal();

        button('Continue').click();
        await flushPromises();

        expect(wrapper.props('isOpen')).toBe(false);
        expect(useTwoFactorAuth().hasSetupData.value).toBe(false);
        wrapper.unmount();
    });

    it('asks for a code and confirms it before closing', async () => {
        const visit = vi
            .spyOn(router, 'visit')
            .mockImplementation((_url, options) =>
                options?.onSuccess?.({ props: {} } as never),
            );
        const wrapper = await modal({ requiresConfirmation: true });

        button('Continue').click();
        await flushPromises();

        expect(document.body.textContent).toContain(
            'Verify authentication code',
        );
        expect(button('Confirm').disabled).toBe(true);

        const otp = document.querySelector<HTMLInputElement>('#otp')!;
        otp.value = '123456';
        otp.dispatchEvent(new Event('input', { bubbles: true }));
        await flushPromises();
        button('Confirm').click();
        await flushPromises();

        expect(visit).toHaveBeenCalledWith(
            '/user/confirmed-two-factor-authentication',
            expect.objectContaining({
                method: 'post',
                data: { code: '123456' },
                errorBag: 'confirmTwoFactorAuthentication',
            }),
        );
        expect(wrapper.props('isOpen')).toBe(false);
        wrapper.unmount();
    });

    it('goes back from the code to the QR code', async () => {
        const wrapper = await modal({ requiresConfirmation: true });

        button('Continue').click();
        await flushPromises();
        button('Back').click();
        await flushPromises();

        expect(document.querySelector('#qr')).not.toBeNull();
        wrapper.unmount();
    });

    it('forgets the setup data on closing once two-factor is enabled', async () => {
        const wrapper = await modal({ twoFactorEnabled: true });

        expect(document.body.textContent).toContain(
            'Two-factor authentication enabled',
        );

        await wrapper.setProps({ isOpen: false });
        await flushPromises();

        expect(useTwoFactorAuth().hasSetupData.value).toBe(false);
        wrapper.unmount();
    });
});
