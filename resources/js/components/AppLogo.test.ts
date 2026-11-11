// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import AppLogo from '@/components/AppLogo.vue';

vi.mock('@inertiajs/vue3', () => ({
    usePage: () => ({ props: { name: 'Laravel' } }),
}));

describe('AppLogo', () => {
    it('shows the app name next to the logo', () => {
        const wrapper = mount(AppLogo);

        expect(wrapper.find('svg').exists()).toBe(true);
        expect(wrapper.text()).toBe('LaravelBeheeromgeving');
    });
});
