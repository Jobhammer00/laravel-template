// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { OTPInput } from 'vue-input-otp';
import TwoFactorChallenge from '@/pages/auth/TwoFactorChallenge.vue';

// happy-dom's FormData has no toStringTag, so Vue wraps the Form defaults in a proxy that breaks on its private fields.
Object.defineProperty(FormData.prototype, Symbol.toStringTag, {
    value: 'FormData',
});

const layout = vi.hoisted(() => ({ props: {} as Record<string, string> }));

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
    setLayoutProps: (props: Record<string, string>) => (layout.props = props),
}));

afterEach(() => {
    vi.restoreAllMocks();
});

const toggle = (wrapper: ReturnType<typeof mount>) =>
    wrapper.find('button[type=button]');

describe('TwoFactorChallenge', () => {
    it('logs in with the code from the authenticator app', async () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        const wrapper = mount(TwoFactorChallenge);

        wrapper.findComponent(OTPInput).vm.$emit('update:modelValue', '123456');
        await flushPromises();
        await wrapper.find('form').trigger('submit');

        expect(layout.props.title).toBe('Authenticatiecode');
        expect(visit).toHaveBeenCalledWith(
            '/two-factor-challenge',
            expect.objectContaining({
                method: 'post',
                data: { code: '123456' },
            }),
        );
    });

    it('empties the code after a wrong one', async () => {
        vi.spyOn(router, 'visit').mockImplementation((_url, options) =>
            options?.onError?.({ code: 'Ongeldige code' }),
        );
        const wrapper = mount(TwoFactorChallenge);
        wrapper.findComponent(OTPInput).vm.$emit('update:modelValue', '999999');
        await flushPromises();

        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(
            wrapper.find<HTMLInputElement>('input[name=code]').element.value,
        ).toBe('');
    });

    it('switches to a recovery code and back', async () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        const wrapper = mount(TwoFactorChallenge);

        expect(toggle(wrapper).text()).toBe('inloggen met een herstelcode');
        await toggle(wrapper).trigger('click');

        expect(layout.props).toEqual({
            title: 'Herstelcode',
            description:
                'Bevestig de toegang tot je account met een van je herstelcodes.',
        });
        wrapper.find<HTMLInputElement>(
            'input[name=recovery_code]',
        ).element.value = 'abcde-fghij';
        await wrapper.find('form').trigger('submit');

        expect(visit).toHaveBeenCalledWith(
            '/two-factor-challenge',
            expect.objectContaining({ data: { recovery_code: 'abcde-fghij' } }),
        );

        await toggle(wrapper).trigger('click');

        expect(layout.props.title).toBe('Authenticatiecode');
        expect(wrapper.find('input[name=recovery_code]').exists()).toBe(false);
    });
});
