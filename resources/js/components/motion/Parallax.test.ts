// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Parallax from '@/components/motion/Parallax.vue';

function lessMotion(matches: boolean) {
    vi.spyOn(window, 'matchMedia').mockReturnValue({
        matches,
    } as MediaQueryList);
}

describe('Parallax', () => {
    afterEach(() => vi.restoreAllMocks());

    it('moves its content with the scroll', () => {
        lessMotion(false);

        const wrapper = mount(Parallax, { slots: { default: 'Foto' } });

        expect(wrapper.text()).toBe('Foto');
        expect(wrapper.attributes('style')).toContain('translate3d(0,');
    });

    it('stands still for less motion', () => {
        lessMotion(true);

        expect(
            mount(Parallax, { slots: { default: 'Foto' } }).attributes('style'),
        ).toBeUndefined();
    });
});
