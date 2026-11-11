// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/users/StatusBadge.vue';

describe('StatusBadge', () => {
    it('shows an active user in the primary colour', () => {
        const wrapper = mount(StatusBadge, { props: { active: true } });

        expect(wrapper.text()).toBe('Actief');
        expect(wrapper.findComponent(Badge).props('variant')).toBe('default');
    });

    it('shows an inactive user in grey', () => {
        const wrapper = mount(StatusBadge, { props: { active: false } });

        expect(wrapper.text()).toBe('Inactief');
        expect(wrapper.findComponent(Badge).props('variant')).toBe('secondary');
    });
});
