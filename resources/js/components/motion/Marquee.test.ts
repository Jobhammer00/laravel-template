// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Marquee from '@/components/motion/Marquee.vue';

describe('Marquee', () => {
    it('runs the content twice, the copy hidden from screen readers', () => {
        const wrapper = mount(Marquee, {
            props: { duration: 12, reverse: true },
            slots: { default: '<span>Logo</span>' },
        });
        const groups = wrapper.findAll('.r14-marquee-group');

        expect(groups.map((group) => group.text())).toEqual(['Logo', 'Logo']);
        expect(groups[1].attributes('aria-hidden')).toBe('true');
        expect(wrapper.attributes('data-reverse')).toBe('true');
        expect(wrapper.attributes('style')).toContain(
            '--marquee-duration: 12s',
        );
    });
});
