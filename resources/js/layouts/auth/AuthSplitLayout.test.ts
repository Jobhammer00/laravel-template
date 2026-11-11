// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import AuthSplitLayout from '@/layouts/auth/AuthSplitLayout.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    usePage: () => ({ props: { name: 'Laravel' } }),
}));

describe('AuthSplitLayout', () => {
    it('shows the app name linking home next to the title and description', () => {
        const wrapper = mount(AuthSplitLayout, {
            props: {
                title: 'Inloggen',
                description: 'Log in met je e-mailadres.',
            },
            slots: { default: '<form>Formulier</form>' },
        });

        expect(wrapper.find('a').attributes('href')).toBe('/');
        expect(wrapper.find('a').text()).toBe('Laravel');
        expect(wrapper.find('h1').text()).toBe('Inloggen');
        expect(wrapper.find('p').text()).toBe('Log in met je e-mailadres.');
        expect(wrapper.find('form').exists()).toBe(true);
    });

    it('leaves out a missing title and description', () => {
        const wrapper = mount(AuthSplitLayout);

        expect(wrapper.find('h1').exists()).toBe(false);
        expect(wrapper.find('p').exists()).toBe(false);
    });
});
