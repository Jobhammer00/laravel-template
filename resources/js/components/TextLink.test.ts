// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TextLink from '@/components/TextLink.vue';
import { login } from '@/routes';

describe('TextLink', () => {
    it('links its text to the given route', () => {
        const wrapper = mount(TextLink, {
            props: { href: login() },
            slots: { default: 'inloggen' },
        });

        expect(wrapper.find('a').attributes('href')).toBe('/login');
        expect(wrapper.text()).toBe('inloggen');
    });
});
