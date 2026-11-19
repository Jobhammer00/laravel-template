// The kit's motion helpers (#280): a screen gets an entrance on scroll, a staggered row or the scroll position in one
// line, instead of sixty of its own. The looks of v-reveal are in resources/css/motion.css ([data-reveal]). B218: the
// design-system export copies this file into the client app as it is.
import { onMounted, onUnmounted, ref } from 'vue';
import type { Directive, Ref } from 'vue';

export type RevealVariant =
    | 'up'
    | 'down'
    | 'left'
    | 'right'
    | 'fade'
    | 'scale'
    | 'blur'
    | 'mask';

let observer: IntersectionObserver | undefined;
function observe(el: Element): void {
    observer ??= new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).dataset.shown = '';
                    observer?.unobserve(entry.target);
                }
            }
        },
        { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(el);
}

/**
 * `v-reveal="'up'"` shows the element when it scrolls into view; `v-reveal:200` waits 200 ms; `v-reveal.stagger`
 * reveals the children one after the other.
 */
export const vReveal: Directive<HTMLElement, RevealVariant | undefined> = {
    mounted(el, { value, arg, modifiers }) {
        const delay = Number(arg ?? 0) || 0;
        const targets = modifiers.stagger
            ? ([...el.children] as HTMLElement[])
            : [el];
        targets.forEach((target, i) => {
            target.dataset.reveal = value ?? 'up';
            target.style.setProperty(
                '--reveal-delay',
                `${delay + (modifiers.stagger ? i * 90 : 0)}ms`,
            );
            observe(target);
        });
    },
};

/**
 * How far an element has scrolled through the screen, from 0 (its top at the bottom of the screen) to 1 (its bottom
 * at the top); without an element, how far the page has scrolled.
 */
export function useScrollProgress(target?: Ref<HTMLElement | null>) {
    const progress = ref(0);
    let frame = 0;
    const measure = () => {
        frame = 0;
        const screen = window.innerHeight;
        if (target) {
            const box = target.value?.getBoundingClientRect();
            progress.value = box
                ? Math.min(
                      1,
                      Math.max(0, (screen - box.top) / (screen + box.height)),
                  )
                : 0;
        } else {
            const room = document.documentElement.scrollHeight - screen;
            progress.value = room > 0 ? Math.min(1, scrollY / room) : 0;
        }
    };
    const schedule = () => (frame ||= requestAnimationFrame(measure));
    onMounted(() => {
        measure();
        addEventListener('scroll', schedule, { passive: true });
        addEventListener('resize', schedule);
    });
    onUnmounted(() => {
        removeEventListener('scroll', schedule);
        removeEventListener('resize', schedule);
        cancelAnimationFrame(frame);
    });

    return progress;
}

/** Whether the person asked their system for less motion. */
export function prefersLessMotion(): boolean {
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
}
