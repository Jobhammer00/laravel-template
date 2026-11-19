// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import SplitText from '@/components/motion/SplitText.vue';

vi.stubGlobal(
    'IntersectionObserver',
    class {
        observe() {}
        unobserve() {}
    },
);

describe('SplitText', () => {
    it('splits the text into words in the given tag, readable as a whole', () => {
        const wrapper = mount(SplitText, {
            props: { text: 'Snel naar huis', tag: 'h1' },
        });
        const words = wrapper.findAll('[aria-hidden] > span');

        expect(wrapper.element.tagName).toBe('H1');
        expect(wrapper.attributes('aria-label')).toBe('Snel naar huis');
        expect(words.map((word) => word.text())).toEqual([
            'Snel',
            'naar',
            'huis',
        ]);
    });

    it('splits into letters with by="char"', () => {
        const wrapper = mount(SplitText, { props: { text: 'Ja', by: 'char' } });

        expect(wrapper.findAll('[aria-hidden] > span')).toHaveLength(2);
    });
});
