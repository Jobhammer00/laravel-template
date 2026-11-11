<script setup lang="ts">
defineProps<{
    title: string;
    description?: string;
}>();
</script>

<template>
    <div
        class="grid gap-x-10 gap-y-3 border-t py-5 first:border-t-0 md:grid-cols-3"
    >
        <div class="flex flex-col gap-[3px]">
            <span class="text-sm leading-5 font-bold">{{ title }}</span>
            <span
                v-if="description"
                class="text-[12.5px] leading-[18px] text-pretty text-muted-foreground"
                >{{ description }}</span
            >
        </div>
        <div class="flex min-w-0 flex-col gap-3 md:col-span-2">
            <slot />
        </div>
    </div>
</template>
