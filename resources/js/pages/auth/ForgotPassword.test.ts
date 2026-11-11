// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ForgotPassword from '@/pages/auth/ForgotPassword.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
}));

afterEach(() => {
    vi.restoreAllMocks();
});

describe('ForgotPassword', () => {
    it('sends a reset link to the given e-mail address', async () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        const wrapper = mount(ForgotPassword);
        wrapper.find<HTMLInputElement>('#email').element.value =
            'piet@example.com';

        await wrapper.find('form').trigger('submit');

        expect(visit).toHaveBeenCalledWith(
            '/forgot-password',
            expect.objectContaining({
                method: 'post',
                data: { email: 'piet@example.com' },
            }),
        );
        expect(wrapper.find('a[href="/login"]').text()).toBe('inloggen');
    });

    it('shows that the link was sent', () => {
        const wrapper = mount(ForgotPassword, {
            props: { status: 'We hebben je een link gemaild.' },
        });

        expect(wrapper.find('.text-success').text()).toBe(
            'We hebben je een link gemaild.',
        );
    });
});
