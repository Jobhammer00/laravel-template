// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import AuthCardLayout from '@/layouts/auth/AuthCardLayout.vue';

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => ({ props: { name: 'Laravel' } }),
}));

describe('AuthCardLayout', () => {
    it('shows the page in a card under the logo', () => {
        const wrapper = mount(AuthCardLayout, {
            props: {
                title: 'Inloggen',
                description: 'Log in met je e-mailadres.',
            },
            slots: { default: '<form>Formulier</form>' },
        });

        expect(wrapper.text()).toContain('Laravel');
        expect(wrapper.find('[data-slot=card-title]').text()).toBe('Inloggen');
        expect(wrapper.find('[data-slot=card-description]').text()).toBe(
            'Log in met je e-mailadres.',
        );
        expect(wrapper.find('[data-slot=card-content] form').exists()).toBe(
            true,
        );
    });
});
