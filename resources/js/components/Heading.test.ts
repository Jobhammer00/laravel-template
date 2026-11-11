// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Heading from '@/components/Heading.vue';

describe('Heading', () => {
    it('shows the title with its description', () => {
        const wrapper = mount(Heading, {
            props: { title: 'Profiel', description: 'Naam en e-mailadres' },
        });

        expect(wrapper.find('h2').text()).toBe('Profiel');
        expect(wrapper.find('p').text()).toBe('Naam en e-mailadres');
    });

    it('leaves out the description and spacing in the small variant', () => {
        const wrapper = mount(Heading, {
            props: { title: 'Profiel', variant: 'small' },
        });

        expect(wrapper.find('p').exists()).toBe(false);
        expect(wrapper.find('header').classes()).toEqual([]);
    });
});
