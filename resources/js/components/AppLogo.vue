<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import AppLogoIcon from '@/components/AppLogoIcon.vue';

const name = usePage().props.name;
</script>

<template>
    <AppLogoIcon class="size-[22px] shrink-0 text-primary" />
    <div
        class="grid flex-1 text-left whitespace-nowrap group-data-[collapsible=icon]:hidden"
    >
        <span
            class="text-[12.5px] leading-[15px] font-extrabold tracking-[0.2em] text-foreground uppercase"
            >{{ name }}</span
        >
        <span
            class="text-[11px] leading-[14px] font-semibold text-muted-foreground"
            >Beheeromgeving</span
        >
    </div>
</template>
