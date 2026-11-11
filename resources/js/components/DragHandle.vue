<script setup lang="ts">
import { GripVertical } from '@lucide/vue';

defineProps<{
    /** Finds the handle again after a keyboard move, see `data-grip`. */
    grip: string;
    label: string;
}>();

const emit = defineEmits<{
    start: [event: PointerEvent];
    move: [by: -1 | 1];
}>();
</script>

<template>
    <button
        type="button"
        :data-grip="grip"
        class="cursor-grab touch-none rounded text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        :aria-label="`${label} verplaatsen, pijltjes omhoog of omlaag`"
        @pointerdown="emit('start', $event)"
        @keydown.up.prevent="emit('move', -1)"
        @keydown.down.prevent="emit('move', 1)"
    >
        <slot><GripVertical class="size-4" /></slot>
    </button>
</template>
