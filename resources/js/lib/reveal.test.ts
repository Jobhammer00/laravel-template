// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent, h, withDirectives } from 'vue';
import { vReveal } from '@/lib/reveal';

const observed: Element[] = [];
let reveal: (entries: { target: Element; isIntersecting: boolean }[]) => void;
vi.stubGlobal(
    'IntersectionObserver',
    class {
        constructor(callback: typeof reveal) {
            reveal = callback;
        }
        observe(el: Element) {
            observed.push(el);
        }
        unobserve() {}
    },
);

function mountWith(binding: Parameters<typeof withDirectives>[1][number]) {
    return mount(
        defineComponent({
            render: () =>
                withDirectives(h('ul', [h('li'), h('li'), h('li')]), [binding]),
        }),
    );
}

describe('vReveal', () => {
    it('marks the element and shows it once it scrolls into view', () => {
        const el = mountWith([vReveal, 'fade', '200']).element as HTMLElement;

        expect(el.dataset.reveal).toBe('fade');
        expect(el.style.getPropertyValue('--reveal-delay')).toBe('200ms');
        expect(el.dataset.shown).toBeUndefined();

        reveal([{ target: el, isIntersecting: true }]);

        expect(el.dataset.shown).toBe('');
    });

    it('reveals the children one after the other with .stagger', () => {
        const el = mountWith([vReveal, undefined, undefined, { stagger: true }])
            .element as HTMLElement;
        const children = [...el.children] as HTMLElement[];

        expect(el.dataset.reveal).toBeUndefined();
        expect(children.map((child) => child.dataset.reveal)).toEqual([
            'up',
            'up',
            'up',
        ]);
        expect(
            children.map((child) =>
                child.style.getPropertyValue('--reveal-delay'),
            ),
        ).toEqual(['0ms', '90ms', '180ms']);
        expect(observed).toEqual(expect.arrayContaining(children));
    });
});
