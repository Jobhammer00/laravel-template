// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Profile from '@/pages/settings/Profile.vue';

// happy-dom's FormData has no toStringTag, so Vue wraps the Form defaults in a proxy that breaks on its private fields.
Object.defineProperty(FormData.prototype, Symbol.toStringTag, {
    value: 'FormData',
});

const props = vi.hoisted(() => ({
    mustVerifyEmail: false,
    status: null as string | null,
    auth: {
        user: {
            id: 1,
            name: 'Piet Jansen',
            email: 'piet@example.com',
            email_verified_at: null as string | null,
            role: 'pim_employee',
        },
        roleLabel: 'PIM medewerker',
        permissions: ['view_products'],
    },
}));

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
    usePage: () => ({ props }),
}));

afterEach(() => {
    props.mustVerifyEmail = false;
    props.status = null;
    props.auth.permissions = ['view_products'];
    vi.restoreAllMocks();
    document.body.innerHTML = '';
});

const saveButton = (wrapper: ReturnType<typeof mount>) =>
    wrapper.find('[data-test=update-profile-button]');

describe('settings Profile', () => {
    it('saves a changed name and confirms it was saved', async () => {
        const visit = vi
            .spyOn(router, 'visit')
            .mockImplementation((_url, options) =>
                options?.onSuccess?.({ props: {} } as never),
            );
        const wrapper = mount(Profile, { attachTo: document.body });

        expect(wrapper.find<HTMLInputElement>('#email').element.value).toBe(
            'piet@example.com',
        );
        expect(saveButton(wrapper).attributes('disabled')).toBeDefined();

        await wrapper.find('#name').setValue('Piet de Vries');

        expect(saveButton(wrapper).attributes('disabled')).toBeUndefined();
        expect(wrapper.text()).toContain('Annuleren');

        await wrapper.find('form').trigger('submit');
        await flushPromises();

        expect(visit).toHaveBeenCalledWith(
            '/settings/profile?_method=PATCH',
            expect.objectContaining({
                method: 'post',
                data: { name: 'Piet de Vries', email: 'piet@example.com' },
                preserveScroll: true,
            }),
        );
        expect(wrapper.text()).toContain('Opgeslagen');
        wrapper.unmount();
    });

    it('shows the role and how many rights come with it', () => {
        const one = mount(Profile);
        expect(one.text()).toContain('PIM medewerker');
        expect(one.text()).toContain('1 recht');

        props.auth.permissions = ['view_products', 'manage_users'];
        expect(mount(Profile).text()).toContain('2 rechten');
    });

    it('offers to send the verification mail again for an unverified address', () => {
        props.mustVerifyEmail = true;
        props.status = 'verification-link-sent';
        const wrapper = mount(Profile);

        expect(wrapper.text()).toContain(
            'Je e-mailadres is nog niet bevestigd.',
        );
        expect(
            wrapper
                .findAll('button')
                .find((button) =>
                    button.text().includes('Stuur de bevestigingsmail'),
                ),
        ).toBeDefined();
        expect(wrapper.text()).toContain('Er is een nieuwe bevestigingslink');
    });

    it('does not ask to verify when that is not required', () => {
        expect(mount(Profile).text()).not.toContain('nog niet bevestigd');
    });
});
