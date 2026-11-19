<script setup lang="ts">
import { computed } from 'vue';
import { vReveal } from '@/lib/reveal';
import type { RevealVariant } from '@/lib/reveal';

// A headline that comes in word by word or letter by letter when it scrolls into view.
const props = withDefaults(
    defineProps<{
        text: string;
        by?: 'word' | 'char';
        variant?: RevealVariant;
        /** The tag, such as h1 or p. */
        tag?: string;
    }>(),
    { by: 'word', variant: 'up', tag: 'span' },
);

const parts = computed(() =>
    props.by === 'word' ? props.text.split(/\s+/) : [...props.text],
);
</script>

<template>
    <component :is="tag" :aria-label="text">
        <span v-reveal.stagger="variant" aria-hidden="true"
            ><span
                v-for="(part, i) in parts"
                :key="i"
                style="display: inline-block; white-space: pre"
                >{{ part
                }}{{ by === 'word' && i < parts.length - 1 ? ' ' : '' }}</span
            ></span
        >
    </component>
</template>
