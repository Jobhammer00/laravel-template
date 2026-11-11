<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>

<template>
    <div class="flex flex-wrap items-center justify-between gap-3 pb-1">
        <h1
            class="shrink-0 text-[26px] leading-8 font-extrabold tracking-tight"
        >
            {{ title }}
        </h1>
        <div
            v-if="$slots.default"
            class="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2"
        >
            <slot />
        </div>
    </div>
</template>
