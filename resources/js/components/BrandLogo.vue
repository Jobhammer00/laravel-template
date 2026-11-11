<script setup lang="ts">
// #267: the client's logo from the design system (the --logo variable). Give it a height; it keeps its proportions.
// Without a logo the design system sets --logo-placeholder to flex, and a neutral mark in the text colour holds its place.
defineProps<{ label?: string }>();
</script>

<template>
    <span
        role="img"
        :aria-label="label ?? 'Logo'"
        class="relative block h-8 w-32 [background-image:var(--logo)] bg-contain bg-left bg-no-repeat"
    >
        <span
            aria-hidden="true"
            class="absolute inset-0 [display:var(--logo-placeholder,none)] items-center gap-2 font-semibold"
        >
            <span class="size-6 rounded-full border-[5px] border-current" />
            Logo
        </span>
    </span>
</template>
