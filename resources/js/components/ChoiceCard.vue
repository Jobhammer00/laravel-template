<script setup lang="ts">
defineProps<{
    name: string;
    title: string;
    hint: string;
    checked: boolean;
}>();

defineEmits<{ select: [] }>();
</script>

<template>
    <label
        class="group flex cursor-pointer flex-col items-start gap-0.5 rounded-lg border bg-card px-3 py-2.5 transition-colors hover:border-primary/60 has-checked:border-primary has-checked:bg-primary-selected has-focus-visible:ring-2 has-focus-visible:ring-ring"
    >
        <input
            type="radio"
            :name="name"
            class="sr-only"
            :checked="checked"
            @change="$emit('select')"
        />
        <span
            class="text-[13px] font-bold group-has-checked:text-primary-selected-foreground"
            >{{ title }}</span
        >
        <span
            class="text-[11.5px] text-muted-foreground group-has-checked:text-primary-selected-foreground"
            >{{ hint }}</span
        >
    </label>
</template>
