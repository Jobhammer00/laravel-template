// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ConfirmPassword from '@/pages/settings/ConfirmPassword.vue';

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

describe('settings ConfirmPassword', () => {
    it('unlocks the security settings with the password or a passkey', async () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        const wrapper = mount(ConfirmPassword);
        wrapper.find<HTMLInputElement>('#password').element.value = 'geheim';

        await wrapper.find('form').trigger('submit');

        expect(wrapper.text()).toContain('Bevestig met passkey');
        expect(visit).toHaveBeenCalledWith(
            '/user/confirm-password',
            expect.objectContaining({
                method: 'post',
                data: { password: 'geheim' },
            }),
        );
    });
});
