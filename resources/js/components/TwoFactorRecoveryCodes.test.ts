// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import TwoFactorRecoveryCodes from '@/components/TwoFactorRecoveryCodes.vue';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';

const server = vi.hoisted(() => ({
    codes: ['code-one', 'code-two'] as string[] | Error,
}));

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    useHttp: () => ({
        submit: vi.fn(async () => {
            if (server.codes instanceof Error) {
                throw server.codes;
            }

            return server.codes;
        }),
    }),
}));

beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
    useTwoFactorAuth().clearTwoFactorAuthData();
    server.codes = ['code-one', 'code-two'];
    vi.restoreAllMocks();
});

const toggle = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findAll('button')[0];

describe('TwoFactorRecoveryCodes', () => {
    it('shows the loaded recovery codes only after asking for them', async () => {
        const wrapper = mount(TwoFactorRecoveryCodes);
        await flushPromises();

        expect(wrapper.find('.h-0').exists()).toBe(true);

        await toggle(wrapper).trigger('click');
        await flushPromises();

        expect(wrapper.find('.h-auto').text()).toContain('code-one');
        expect(wrapper.find('.h-auto').text()).toContain('code-two');
        expect(toggle(wrapper).text()).toBe('Hide recovery codes');
        expect(Element.prototype.scrollIntoView).toHaveBeenCalled();

        await toggle(wrapper).trigger('click');

        expect(wrapper.find('.h-0').exists()).toBe(true);
    });

    it('loads the codes on viewing when they failed to load before', async () => {
        server.codes = new Error('500');
        const wrapper = mount(TwoFactorRecoveryCodes);
        await flushPromises();

        server.codes = ['code-three'];
        await toggle(wrapper).trigger('click');
        await flushPromises();

        expect(wrapper.text()).toContain('code-three');
    });

    it('shows why the codes could not be loaded', async () => {
        server.codes = new Error('500');
        const wrapper = mount(TwoFactorRecoveryCodes);
        await flushPromises();

        expect(wrapper.text()).toContain('Failed to fetch recovery codes');
    });

    it('regenerates the codes and shows the new ones', async () => {
        const visit = vi
            .spyOn(router, 'visit')
            .mockImplementation((_url, options) =>
                options?.onSuccess?.({ props: {} } as never),
            );
        const wrapper = mount(TwoFactorRecoveryCodes);
        await flushPromises();
        await toggle(wrapper).trigger('click');
        await flushPromises();

        server.codes = ['code-new'];
        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(visit).toHaveBeenCalledWith(
            '/user/two-factor-recovery-codes',
            expect.objectContaining({ method: 'post', preserveScroll: true }),
        );
        expect(wrapper.text()).toContain('code-new');
        expect(wrapper.text()).not.toContain('code-one');
    });
});
