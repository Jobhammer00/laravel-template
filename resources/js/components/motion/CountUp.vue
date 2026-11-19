<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { prefersLessMotion } from '@/lib/reveal';

// A number that counts up to its value when it scrolls into view, in Dutch notation.
const props = withDefaults(
    defineProps<{
        to: number;
        from?: number;
        /** In milliseconds. */
        duration?: number;
        decimals?: number;
        prefix?: string;
        suffix?: string;
    }>(),
    { from: 0, duration: 1600, decimals: 0, prefix: '', suffix: '' },
);

const el = ref<HTMLElement | null>(null);
const value = ref(props.from);
const text = computed(
    () =>
        props.prefix +
        value.value.toLocaleString('nl-NL', {
            minimumFractionDigits: props.decimals,
            maximumFractionDigits: props.decimals,
        }) +
        props.suffix,
);

let frame = 0;
let observer: IntersectionObserver | undefined;
function run() {
    const start = performance.now();
    const step = (now: number) => {
        const t = Math.min(1, (now - start) / props.duration);
        value.value = props.from + (props.to - props.from) * (1 - (1 - t) ** 3);
        frame = t < 1 ? requestAnimationFrame(step) : 0;
    };
    frame = requestAnimationFrame(step);
}
onMounted(() => {
    if (prefersLessMotion() || !el.value) {
        value.value = props.to;

        return;
    }
    observer = new IntersectionObserver(([entry]) => {
        if (entry?.isIntersecting) {
            observer?.disconnect();
            run();
        }
    });
    observer.observe(el.value);
});
onUnmounted(() => {
    observer?.disconnect();
    cancelAnimationFrame(frame);
});
</script>

<template>
    <span ref="el" style="font-variant-numeric: tabular-nums">{{ text }}</span>
</template>
