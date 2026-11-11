// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'vue-sonner';
import Edit from '@/pages/users/Edit.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
    setLayoutProps: () => {},
    usePage: () => ({ props: { auth: { user: { id: 1 } } } }),
}));

vi.mock('vue-sonner', () => ({ toast: { error: vi.fn() } }));

const roles = [
    {
        value: 'admin',
        label: 'Admin',
        tag: 'Alles',
        permissions: ['manage_users', 'manage_products'],
    },
    {
        value: 'pim_employee',
        label: 'PIM medewerker',
        tag: 'Producten',
        permissions: ['manage_products'],
    },
] as never as App.Data.RoleData[];

const permissionGroups = [
    {
        label: 'Beheer',
        permissions: [
            { value: 'manage_users', label: 'Gebruikers' },
            { value: 'manage_products', label: 'Producten' },
        ],
    },
] as never as App.Data.PermissionGroupData[];

// The save and delete buttons teleport into the layout's page actions.
beforeEach(() => {
    const actions = document.createElement('div');
    actions.id = 'page-actions';
    document.body.append(actions);
});

afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

const page = (id: number, permissions = ['manage_users', 'manage_products']) =>
    mount(Edit, {
        props: {
            user: {
                id,
                name: 'Piet',
                email: 'piet@example.com',
                is_active: true,
                role: 'admin',
                permissions,
            } as never,
            roles,
            permissionGroups,
            canDelete: false,
        },
        attachTo: document.body,
    });

describe('Edit user', () => {
    it('asks how to apply the rights as soon as another role is clicked', async () => {
        const wrapper = page(2);

        await wrapper.findAll('[role=radio]')[1].trigger('click');
        await flushPromises();

        expect(document.body.textContent).toContain('Alles overschrijven');
        wrapper.unmount();
    });

    it('refuses on the click when you change your own role or rights', async () => {
        const wrapper = page(1);

        await wrapper.findAll('[role=radio]')[1].trigger('click');
        await wrapper.find('#permission-manage_users').trigger('click');
        await flushPromises();

        expect(toast.error).toHaveBeenCalledTimes(2);
        expect(toast.error).toHaveBeenCalledWith(
            'Je kunt je eigen rol en rechten niet wijzigen.',
        );
        expect(document.body.textContent).not.toContain('Alles overschrijven');
        expect(
            wrapper.find('#permission-manage_users').attributes('data-state'),
        ).toBe('checked');
        expect(
            wrapper.find('[role=radio][aria-checked=true]').text(),
        ).toContain('Admin');
        wrapper.unmount();
    });

    it('refuses applying your own role when your rights differ from it', async () => {
        const wrapper = page(1, ['manage_products']);

        await wrapper.findAll('[role=radio]')[0].trigger('click');
        await flushPromises();

        expect(toast.error).toHaveBeenCalledWith(
            'Je kunt je eigen rol en rechten niet wijzigen.',
        );
        expect(document.body.textContent).not.toContain('Alles overschrijven');
        wrapper.unmount();
    });

    it('gives a new user the rights of the chosen role without asking', async () => {
        const post = vi.spyOn(router, 'post').mockImplementation(() => {});
        const wrapper = mount(Edit, {
            props: { user: null, roles, permissionGroups, canDelete: false },
            attachTo: document.body,
        });

        expect(wrapper.text()).toContain(
            'De gebruiker krijgt op dit adres een uitnodiging',
        );
        expect(wrapper.text()).toContain('2 van 2 rechten toegekend');

        await wrapper.findAll('[role=radio]')[1].trigger('click');
        await wrapper.find('#name').setValue('Klaas');
        await wrapper.find('#email').setValue('klaas@example.com');
        await wrapper.find('form').trigger('submit');

        expect(document.body.textContent).not.toContain('Alles overschrijven');
        expect(post).toHaveBeenCalledWith(
            '/users',
            {
                name: 'Klaas',
                email: 'klaas@example.com',
                is_active: true,
                role: 'pim_employee',
                permissions: ['manage_products'],
            },
            expect.anything(),
        );

        (
            post.mock.calls[0][2] as {
                onError: (errors: Record<string, string>) => void;
            }
        ).onError({ email: 'Dit e-mailadres is al in gebruik.' });

        expect(toast.error).toHaveBeenCalledWith(
            'Dit e-mailadres is al in gebruik.',
        );
        wrapper.unmount();
    });

    it('shows how the rights deviate from the role and overwrites them on request', async () => {
        const put = vi.spyOn(router, 'put').mockImplementation(() => {});
        const wrapper = page(2);

        await wrapper.find('#permission-manage_users').trigger('click');
        await flushPromises();

        expect(wrapper.text()).toContain('Wijkt af van Admin: 1 ontbreekt');
        expect(wrapper.text()).toContain('1 van 2 rechten toegekend');

        await wrapper
            .findAll('button')
            .find((button) => button.text() === 'Toepassen volgens rol')!
            .trigger('click');
        await flushPromises();

        expect(document.body.textContent).toContain('Rechten volgens Admin');

        [...document.body.querySelectorAll('button')]
            .find(
                (button) =>
                    button.textContent?.trim() === 'Alles overschrijven',
            )!
            .click();
        await flushPromises();

        expect(wrapper.text()).toContain('2 van 2 rechten toegekend');
        expect(wrapper.text()).not.toContain('Wijkt af');

        await wrapper.find('form').trigger('submit');

        expect(put).toHaveBeenCalledWith(
            '/users/2',
            expect.objectContaining({
                role: 'admin',
                permissions: ['manage_users', 'manage_products'],
            }),
            expect.objectContaining({ preserveScroll: true }),
        );
        wrapper.unmount();
    });

    it('only adds the missing rights of the new role when merging', async () => {
        const wrapper = mount(Edit, {
            props: {
                user: {
                    id: 2,
                    name: 'Piet',
                    email: 'piet@example.com',
                    is_active: true,
                    role: 'pim_employee',
                    permissions: ['manage_users'],
                } as never,
                roles,
                permissionGroups,
                canDelete: false,
            },
            attachTo: document.body,
        });

        expect(wrapper.text()).toContain(
            'Wijkt af van PIM medewerker: 1 extra · 1 ontbreekt',
        );

        await wrapper.findAll('[role=radio]')[1].trigger('click');
        await flushPromises();
        [...document.body.querySelectorAll('button')]
            .find(
                (button) => button.textContent?.trim() === 'Alleen aanvullen',
            )!
            .click();
        await flushPromises();

        expect(wrapper.text()).toContain('2 van 2 rechten toegekend');
        expect(wrapper.text()).toContain(
            'Wijkt af van PIM medewerker: 1 extra',
        );
        wrapper.unmount();
    });

    it('searches the rights by label', async () => {
        const wrapper = page(2);

        await wrapper.find('input[type=search]').setValue('gebr');

        expect(wrapper.find('#permission-manage_users').exists()).toBe(true);
        expect(wrapper.find('#permission-manage_products').exists()).toBe(
            false,
        );

        await wrapper.find('input[type=search]').setValue('facturen');

        expect(wrapper.text()).toContain(
            'Geen functionaliteit gevonden voor „facturen”.',
        );
        wrapper.unmount();
    });

    it('offers deleting and, once changed, saving in the page actions', async () => {
        const actions = document.getElementById('page-actions')!;
        const wrapper = mount(Edit, {
            props: {
                user: {
                    id: 2,
                    name: 'Piet',
                    email: 'piet@example.com',
                    is_active: true,
                    role: 'admin',
                    permissions: ['manage_users', 'manage_products'],
                } as never,
                roles,
                permissionGroups,
                canDelete: true,
            },
            attachTo: document.body,
        });
        await flushPromises();

        expect(actions.textContent).not.toContain('Opslaan');

        await wrapper.find('#name').setValue('Piet Jansen');

        expect(actions.textContent).toContain('Opslaan');
        expect(actions.querySelector('a')!.getAttribute('href')).toBe('/users');

        [...actions.querySelectorAll('button')]
            .find((button) => button.textContent?.trim() === 'Verwijderen')!
            .click();
        await flushPromises();

        expect(document.body.textContent).toContain('Piet verwijderen?');
        wrapper.unmount();
    });
});
