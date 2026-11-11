// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DragHandle from '@/components/DragHandle.vue';

describe('DragHandle', () => {
    it('starts a drag on press and moves one place with the arrow keys', async () => {
        const wrapper = mount(DragHandle, {
            props: { grip: 'step-3', label: 'Stap 3' },
        });
        const button = wrapper.find('button');

        await button.trigger('pointerdown');
        await button.trigger('keydown', { key: 'ArrowUp' });
        await button.trigger('keydown', { key: 'ArrowDown' });

        expect(wrapper.emitted('start')).toHaveLength(1);
        expect(wrapper.emitted('move')).toEqual([[-1], [1]]);
        expect(button.attributes('data-grip')).toBe('step-3');
        expect(button.attributes('aria-label')).toBe(
            'Stap 3 verplaatsen, pijltjes omhoog of omlaag',
        );
    });
});
