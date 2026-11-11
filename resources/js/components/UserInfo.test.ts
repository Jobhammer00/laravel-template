// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import UserInfo from '@/components/UserInfo.vue';
import type { User } from '@/types';

const user = { id: 1, name: 'Piet Jansen', email: 'piet@example.com' } as User;

describe('UserInfo', () => {
    it('shows the initials, name and subtitle', () => {
        const wrapper = mount(UserInfo, {
            props: { user, subtitle: 'Admin' },
        });

        expect(wrapper.find('[aria-hidden=true]').text()).toBe('PJ');
        expect(wrapper.text()).toContain('Piet Jansen');
        expect(wrapper.text()).toContain('Admin');
    });

    it('leaves out an empty subtitle', () => {
        const wrapper = mount(UserInfo, { props: { user } });

        expect(wrapper.findAll('.truncate')).toHaveLength(1);
    });
});
