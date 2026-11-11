<script setup lang="ts">
import type { Component } from 'vue';

// One empty state for every screen: an icon, a short text, and optionally a way out.
defineProps<{ icon?: Component }>();
</script>

<template>
    <div
        class="grid place-items-center gap-3 px-5 py-[60px] text-center text-muted-foreground"
    >
        <component :is="icon" v-if="icon" class="size-7" :stroke-width="1.6" />
        <p class="m-0 leading-normal"><slot /></p>
        <slot name="actions" />
    </div>
</template>
