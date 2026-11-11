// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import AuthLayout from '@/layouts/AuthLayout.vue';

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => ({ props: { name: 'Laravel' } }),
}));

describe('AuthLayout', () => {
    it('shows the auth page in the card layout', () => {
        const wrapper = mount(AuthLayout, {
            props: { title: 'Wachtwoord vergeten' },
            slots: { default: '<form>Formulier</form>' },
        });

        expect(wrapper.find('[data-slot=card-title]').text()).toBe(
            'Wachtwoord vergeten',
        );
        expect(wrapper.find('[data-slot=card-description]').text()).toBe('');
        expect(wrapper.find('form').exists()).toBe(true);
    });
});
