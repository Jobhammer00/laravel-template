<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import type { Ghost } from '@/composables/usePointerDrag';
import { cn } from '@/lib/utils';

const props = defineProps<{
    ghost: Ghost;
    class?: HTMLAttributes['class'];
}>();
</script>

<template>
    <Teleport to="body">
        <div
            :class="
                cn(
                    'pointer-events-none fixed top-0 left-0 z-50 flex items-center gap-2.5 border border-primary/60 bg-card shadow-lg',
                    props.class,
                )
            "
            :style="{
                width: `${ghost.width}px`,
                transform: `translate(${ghost.x}px, ${ghost.y}px)`,
            }"
        >
            <slot />
        </div>
    </Teleport>
</template>
