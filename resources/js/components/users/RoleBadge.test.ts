// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Badge } from '@/components/ui/badge';
import RoleBadge from '@/components/users/RoleBadge.vue';

const variant = (role: string) =>
    mount(RoleBadge, { props: { role, label: 'Rol' } })
        .findComponent(Badge)
        .props('variant');

describe('RoleBadge', () => {
    it('shows the label in the colour of the role', () => {
        const wrapper = mount(RoleBadge, {
            props: { role: 'employee', label: 'Medewerker' },
        });

        expect(wrapper.text()).toBe('Medewerker');
        expect(variant('employee')).toBe('outline');
        expect(variant('admin')).toBe('secondary');
    });

    it('falls back to grey for an unknown role', () => {
        expect(variant('guest')).toBe('secondary');
    });
});
