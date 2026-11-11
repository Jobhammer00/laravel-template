// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AlertError from '@/components/AlertError.vue';

describe('AlertError', () => {
    it('lists each error once under the default title', () => {
        const wrapper = mount(AlertError, {
            props: { errors: ['Mislukt', 'Mislukt', 'Te laat'] },
        });

        expect(wrapper.text()).toContain('Something went wrong.');
        expect(wrapper.findAll('li').map((item) => item.text())).toEqual([
            'Mislukt',
            'Te laat',
        ]);
    });

    it('shows a given title', () => {
        const wrapper = mount(AlertError, {
            props: { errors: [], title: 'Opslaan mislukt' },
        });

        expect(wrapper.text()).toContain('Opslaan mislukt');
    });
});
