// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Index from '@/pages/users/Index.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
}));

const roles = [
    {
        value: 'admin',
        label: 'Admin',
        tag: 'Alles',
        permissions: ['manage_users'],
    },
] as never as App.Data.RoleData[];

const user = (data: Partial<App.Data.UserData>): App.Data.UserData => ({
    id: 1,
    name: 'Piet',
    email: 'piet@example.com',
    role: 'admin',
    is_active: true,
    permissions: ['manage_users'],
    ...data,
});

const mountIndex = (users: App.Data.UserData[]): ReturnType<typeof mount> =>
    mount(Index, { props: { users, permissionTotal: 5, roles } });

describe('users/Index', () => {
    it('links each user to the edit page and the add button to the create page', () => {
        const wrapper = mountIndex([user({ id: 4 })]);

        expect(wrapper.find('a[href="/users/4/edit"]').text()).toBe('Piet');
        expect(wrapper.find('a[href="/users/create"]').text()).toContain(
            'Gebruiker toevoegen',
        );
    });

    it('shows the role, the number of rights and the status', () => {
        const row = mountIndex([user({ is_active: false })]).find('tbody tr');

        expect(row.text()).toContain('Admin');
        expect(row.text()).toContain('1 van 5 rechten');
        expect(row.text()).toContain('Inactief');
        expect(row.text()).not.toContain('afwijkend');
    });

    it('marks rights that deviate from the role', () => {
        const row = mountIndex([user({ permissions: [] })]).find('tbody tr');

        expect(row.text()).toContain('0 van 5 rechten');
        expect(row.text()).toContain('afwijkend');
    });

    it('falls back to the raw role for a role it does not know', () => {
        const row = mountIndex([
            user({ role: 'ghost' as App.Enums.Role, permissions: [] }),
        ]).find('tbody tr');

        expect(row.text()).toContain('ghost');
        expect(row.text()).not.toContain('afwijkend');
    });
});
