<script setup lang="ts">
import type { HTMLAttributes } from 'vue';

defineOptions({
    inheritAttrs: false,
});

type Props = {
    className?: HTMLAttributes['class'];
};

defineProps<Props>();
</script>

<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 40 40"
        :class="className"
        v-bind="$attrs"
    >
        <path
            fill="currentColor"
            d="M20 0 C21 11 29 19 40 20 C29 21 21 29 20 40 C19 29 11 21 0 20 C11 19 19 11 20 0Z"
        />
    </svg>
</template>
