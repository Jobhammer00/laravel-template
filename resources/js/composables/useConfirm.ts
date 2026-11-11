import { ref, shallowRef } from 'vue';

/**
 * Open state apart from the target: the target stays after closing, so a
 * confirm dialog keeps its text while it animates out.
 */
export function useConfirm<T>() {
    const target = shallowRef<T | null>(null);
    const open = ref(false);

    function ask(value: T): void {
        target.value = value;
        open.value = true;
    }

    return { target, open, ask };
}
