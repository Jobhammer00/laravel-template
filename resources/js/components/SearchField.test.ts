// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SearchField from '@/components/SearchField.vue';

describe('SearchField', () => {
    it('updates the query while typing and shows the count', async () => {
        const wrapper = mount(SearchField, {
            props: {
                placeholder: 'Zoek product',
                count: '12 producten',
                modelValue: '',
                'onUpdate:modelValue': (value: string) =>
                    wrapper.setProps({ modelValue: value }),
            },
        });

        await wrapper.find('input').setValue('rol');

        expect(wrapper.props('modelValue')).toBe('rol');
        expect(wrapper.find('input').attributes('aria-label')).toBe(
            'Zoek product',
        );
        expect(wrapper.text()).toContain('12 producten');
    });

    it('is lower in the small size', () => {
        const wrapper = mount(SearchField, {
            props: { placeholder: 'Zoek', size: 'sm', modelValue: '' },
        });

        expect(wrapper.find('label').classes()).toContain('h-8');
    });
});
