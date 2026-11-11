import { onBeforeUnmount, ref } from 'vue';

export type Ghost = { x: number; y: number; width: number };

type Options = {
    /** Called on every move once dragging, with the element under the pointer. */
    onMove: (target: Element | null, y: number) => void;
    onEnd: (dropped: boolean) => void;
};

// A drag only starts after this many pixels, so a click on the grip stays a click.
const THRESHOLD = 4;
const EDGE = 60;
const SCROLL_STEP = 14;

/** Classes for the spot the dragged card left: an empty dashed outline. */
export const PLACEHOLDER =
    'border-dashed border-primary/60 bg-primary/5 shadow-none [&>*]:invisible';

/**
 * Drags with pointer events instead of native drag and drop, so the dragged card is our own
 * element (opaque, styled) and works with touch. The caller turns the element under the
 * pointer into a move.
 */
export function usePointerDrag({ onMove, onEnd }: Options) {
    const ghost = ref<Ghost | null>(null);
    let pending: {
        startX: number;
        startY: number;
        offsetX: number;
        offsetY: number;
        width: number;
        begin: () => void;
    } | null = null;

    function start(
        event: PointerEvent,
        card: HTMLElement,
        begin: () => void,
    ): void {
        if (event.button !== 0) {
            return;
        }

        const rect = card.getBoundingClientRect();
        pending = {
            startX: event.clientX,
            startY: event.clientY,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top,
            width: rect.width,
            begin,
        };
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', cancel);
        window.addEventListener('keydown', escape);
    }

    function up(): void {
        stop(true);
    }

    function cancel(): void {
        stop(false);
    }

    function escape(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            stop(false);
        }
    }

    function move(event: PointerEvent): void {
        if (!pending) {
            return;
        }

        if (!ghost.value) {
            if (
                Math.hypot(
                    event.clientX - pending.startX,
                    event.clientY - pending.startY,
                ) < THRESHOLD
            ) {
                return;
            }

            pending.begin();
            document.body.style.userSelect = 'none';
        }

        ghost.value = {
            x: event.clientX - pending.offsetX,
            y: event.clientY - pending.offsetY,
            width: pending.width,
        };

        // ponytail: scrolls only while the pointer moves; a timer loop if long lists need it.
        if (event.clientY < EDGE) {
            window.scrollBy(0, -SCROLL_STEP);
        } else if (event.clientY > window.innerHeight - EDGE) {
            window.scrollBy(0, SCROLL_STEP);
        }

        onMove(
            document.elementFromPoint(event.clientX, event.clientY),
            event.clientY,
        );
    }

    function stop(dropped: boolean): void {
        const started = ghost.value !== null;
        pending = null;
        ghost.value = null;
        document.body.style.userSelect = '';
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', cancel);
        window.removeEventListener('keydown', escape);

        if (started) {
            onEnd(dropped);
        }
    }

    onBeforeUnmount(() => stop(false));

    return { ghost, start };
}

/**
 * Whether the pointer is far enough over a neighbour to swap with it: past its middle, seen
 * from where the dragged item comes from. Without this, items of different heights swap back
 * and forth under a still pointer.
 */
export function pastMiddle(
    downward: boolean,
    y: number,
    rect: { top: number; height: number },
): boolean {
    const middle = rect.top + rect.height / 2;

    return downward ? y > middle : y < middle;
}
