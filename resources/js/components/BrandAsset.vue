<script setup lang="ts">
import { asset } from '@/lib/assets';

// One of the design system's assets by its name; size and fit come from the class you give it.
defineProps<{ name: string; alt?: string }>();
</script>

<template>
    <img :src="asset(name)" :alt="alt ?? ''" class="block object-cover" />
</template>
