// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ManagePasskeys from '@/components/ManagePasskeys.vue';
import ManageTwoFactor from '@/components/ManageTwoFactor.vue';
import Security from '@/pages/settings/Security.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
    usePage: () => ({ props: { markerProject: null } }),
}));

afterEach(() => {
    vi.restoreAllMocks();
});

const security = () =>
    mount(Security, {
        props: {
            passwordRules: 'minlength: 12;',
            canManageTwoFactor: true,
            requiresConfirmation: true,
            twoFactorEnabled: false,
            canManagePasskeys: false,
            passkeys: [],
        },
        global: { stubs: { ManageTwoFactor: true, ManagePasskeys: true } },
    });

describe('settings Security', () => {
    it('changes the password with the current one', async () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        const wrapper = security();
        const fill = (id: string, value: string) =>
            (wrapper.find<HTMLInputElement>(`#${id}`).element.value = value);
        fill('current_password', 'oud');
        fill('password', 'nieuw-geheim');
        fill('password_confirmation', 'nieuw-geheim');

        await wrapper.find('form').trigger('submit');

        expect(wrapper.find('#password').attributes('passwordrules')).toBe(
            'minlength: 12;',
        );
        expect(visit).toHaveBeenCalledWith(
            '/settings/password?_method=PUT',
            expect.objectContaining({
                data: {
                    current_password: 'oud',
                    password: 'nieuw-geheim',
                    password_confirmation: 'nieuw-geheim',
                },
                preserveScroll: true,
            }),
        );
    });

    it('passes the two-factor and passkey settings on', () => {
        const wrapper = security();

        expect(wrapper.findComponent(ManageTwoFactor).props()).toEqual({
            canManageTwoFactor: true,
            requiresConfirmation: true,
            twoFactorEnabled: false,
        });
        expect(wrapper.findComponent(ManagePasskeys).props()).toEqual({
            canManagePasskeys: false,
            passkeys: [],
        });
    });
});
