// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import CountUp from '@/components/motion/CountUp.vue';

describe('CountUp', () => {
    it('shows the end value at once, in Dutch notation, for less motion', async () => {
        vi.spyOn(window, 'matchMedia').mockReturnValue({
            matches: true,
        } as MediaQueryList);

        const wrapper = mount(CountUp, {
            props: { to: 1234.5, decimals: 1, prefix: '€ ', suffix: '+' },
        });
        await nextTick();

        expect(wrapper.text()).toBe('€ 1.234,5+');
    });
});
