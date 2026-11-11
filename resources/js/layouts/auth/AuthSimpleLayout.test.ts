// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AuthSimpleLayout from '@/layouts/auth/AuthSimpleLayout.vue';

describe('AuthSimpleLayout', () => {
    it('shows the title and description with the logo linking home', () => {
        const wrapper = mount(AuthSimpleLayout, {
            props: {
                title: 'Inloggen',
                description: 'Log in met je e-mailadres.',
            },
            slots: { default: '<form>Formulier</form>' },
        });

        expect(wrapper.find('a').attributes('href')).toBe('/');
        expect(wrapper.find('h1').text()).toBe('Inloggen');
        expect(wrapper.text()).toContain('Log in met je e-mailadres.');
        expect(wrapper.find('form').exists()).toBe(true);
    });
});
