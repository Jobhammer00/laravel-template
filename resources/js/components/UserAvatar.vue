<script setup lang="ts">
import { computed } from 'vue';
import { getInitials } from '@/composables/useInitials';

const props = withDefaults(
    defineProps<{
        name: string;
        size?: number;
    }>(),
    { size: 32 },
);

const style = computed(() => ({
    width: `${props.size}px`,
    height: `${props.size}px`,
    fontSize: `${Math.round(props.size * 0.36)}px`,
}));
</script>

<template>
    <span
        aria-hidden="true"
        class="inline-flex shrink-0 items-center justify-center rounded-full bg-primary-muted leading-none font-extrabold text-primary"
        :style="style"
        >{{ getInitials(name) }}</span
    >
</template>
