<script setup lang="ts">
import { computed, ref } from 'vue';
import { prefersLessMotion, useScrollProgress } from '@/lib/reveal';

// Its content moves slower (or faster, with a negative speed) than the page as you scroll: a photo behind type.
const props = withDefaults(
    defineProps<{
        /** 0.2 lags a little behind the page; -0.2 runs ahead. */
        speed?: number;
    }>(),
    { speed: 0.2 },
);

const el = ref<HTMLElement | null>(null);
const progress = useScrollProgress(el);
const still = prefersLessMotion();
const style = computed(() =>
    still
        ? {}
        : {
              transform: `translate3d(0, ${((0.5 - progress.value) * props.speed * 60).toFixed(2)}vh, 0)`,
              willChange: 'transform',
          },
);
</script>

<template>
    <div ref="el" :style="style"><slot /></div>
</template>
