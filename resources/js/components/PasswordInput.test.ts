// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import PasswordInput from '@/components/PasswordInput.vue';

afterEach(() => {
    document.body.innerHTML = '';
});

describe('PasswordInput', () => {
    it('shows and hides the password with the eye button', async () => {
        const wrapper = mount(PasswordInput, {
            attrs: { name: 'password', id: 'password' },
        });
        const input = wrapper.find('input');
        const toggle = wrapper.find('button');

        expect(input.attributes('type')).toBe('password');
        expect(input.attributes('name')).toBe('password');

        await toggle.trigger('click');
        expect(input.attributes('type')).toBe('text');
        expect(toggle.attributes('aria-label')).toBe('Hide password');

        await toggle.trigger('click');
        expect(input.attributes('type')).toBe('password');
    });

    it('can be focused from outside', () => {
        const wrapper = mount(PasswordInput, { attachTo: document.body });

        (wrapper.vm as unknown as { focus: () => void }).focus();

        expect(document.activeElement).toBe(wrapper.find('input').element);
        wrapper.unmount();
    });
});
