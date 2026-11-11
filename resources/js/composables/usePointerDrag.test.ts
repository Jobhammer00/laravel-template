// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { pastMiddle, usePointerDrag } from '@/composables/usePointerDrag';

const rect = { top: 100, height: 40 };

describe('pastMiddle', () => {
    it('swaps downward only below the middle of the neighbour', () => {
        expect(pastMiddle(true, 115, rect)).toBe(false);
        expect(pastMiddle(true, 125, rect)).toBe(true);
    });

    it('swaps upward only above the middle of the neighbour', () => {
        expect(pastMiddle(false, 125, rect)).toBe(false);
        expect(pastMiddle(false, 115, rect)).toBe(true);
    });
});

const pointer = (type: string, clientX: number, clientY: number): void => {
    window.dispatchEvent(
        Object.assign(new Event(type), { clientX, clientY }) as Event,
    );
};

const drag = () => {
    const onMove = vi.fn();
    const onEnd = vi.fn();
    const begin = vi.fn();
    let state!: ReturnType<typeof usePointerDrag>;
    const wrapper = mount(
        defineComponent({
            setup() {
                state = usePointerDrag({ onMove, onEnd });

                return () => h('div');
            },
        }),
    );
    const card = document.createElement('div');
    card.getBoundingClientRect = () =>
        ({ left: 10, top: 200, width: 300 }) as DOMRect;
    const press = (button = 0): void =>
        state.start(
            { button, clientX: 20, clientY: 210 } as PointerEvent,
            card,
            begin,
        );

    return { state, press, onMove, onEnd, begin, wrapper };
};

afterEach(() => {
    vi.restoreAllMocks();
});

describe('usePointerDrag', () => {
    it('keeps a small pointer move a click instead of a drag', () => {
        const { state, press, begin, onEnd } = drag();
        press();

        pointer('pointermove', 22, 211);
        pointer('pointerup', 22, 211);

        expect(begin).not.toHaveBeenCalled();
        expect(state.ghost.value).toBeNull();
        expect(onEnd).not.toHaveBeenCalled();
    });

    it('drags a ghost along with the pointer and drops it on release', () => {
        const { state, press, begin, onMove, onEnd } = drag();
        press();

        pointer('pointermove', 30, 300);

        expect(begin).toHaveBeenCalledOnce();
        expect(state.ghost.value).toEqual({ x: 20, y: 290, width: 300 });
        expect(document.body.style.userSelect).toBe('none');
        expect(onMove).toHaveBeenCalledWith(null, 300);

        pointer('pointerup', 30, 300);

        expect(onEnd).toHaveBeenCalledWith(true);
        expect(state.ghost.value).toBeNull();
        expect(document.body.style.userSelect).toBe('');
    });

    it('scrolls the page when dragging near its top or bottom edge', () => {
        const scrollBy = vi
            .spyOn(window, 'scrollBy')
            .mockImplementation(() => {});
        const { press } = drag();
        press();

        pointer('pointermove', 20, 10);
        pointer('pointermove', 20, window.innerHeight - 10);

        expect(scrollBy).toHaveBeenNthCalledWith(1, 0, -14);
        expect(scrollBy).toHaveBeenNthCalledWith(2, 0, 14);
    });

    it('cancels the drag on Escape or a cancelled pointer, without a drop', () => {
        const { press, onEnd } = drag();
        press();
        pointer('pointermove', 30, 300);

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(onEnd).not.toHaveBeenCalled();

        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        expect(onEnd).toHaveBeenCalledWith(false);

        press();
        pointer('pointermove', 30, 300);
        pointer('pointercancel', 30, 300);
        expect(onEnd).toHaveBeenLastCalledWith(false);
    });

    it('ignores other mouse buttons than the main one', () => {
        const { press, begin } = drag();
        press(2);

        pointer('pointermove', 30, 300);

        expect(begin).not.toHaveBeenCalled();
    });

    it('stops listening when the component unmounts', () => {
        const { press, begin, onEnd, wrapper } = drag();
        press();
        pointer('pointermove', 30, 300);

        wrapper.unmount();
        pointer('pointermove', 40, 400);

        expect(onEnd).toHaveBeenCalledWith(false);
        expect(begin).toHaveBeenCalledOnce();
    });
});
