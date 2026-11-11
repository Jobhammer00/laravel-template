// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ResetPassword from '@/pages/auth/ResetPassword.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
    usePage: () => ({ props: { markerProject: null } }),
}));

afterEach(() => {
    vi.restoreAllMocks();
});

describe('ResetPassword', () => {
    it('saves the new password with the token and e-mail address of the link', async () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        const wrapper = mount(ResetPassword, {
            props: {
                token: 'abc123',
                email: 'piet@example.com',
                passwordRules: 'minlength: 12;',
            },
        });
        const email = wrapper.find<HTMLInputElement>('#email').element;
        wrapper.find<HTMLInputElement>('#password').element.value =
            'nieuw-geheim';
        wrapper.find<HTMLInputElement>('#password_confirmation').element.value =
            'nieuw-geheim';

        await wrapper.find('form').trigger('submit');

        expect(email.value).toBe('piet@example.com');
        expect(email.readOnly).toBe(true);
        expect(wrapper.find('#password').attributes('passwordrules')).toBe(
            'minlength: 12;',
        );
        expect(visit).toHaveBeenCalledWith(
            '/reset-password',
            expect.objectContaining({
                method: 'post',
                data: {
                    token: 'abc123',
                    email: 'piet@example.com',
                    password: 'nieuw-geheim',
                    password_confirmation: 'nieuw-geheim',
                },
            }),
        );
    });
});
