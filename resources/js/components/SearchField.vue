<script setup lang="ts">
import { Search } from '@lucide/vue';

withDefaults(
    defineProps<{
        placeholder: string;
        count?: string;
        size?: 'sm' | 'default';
    }>(),
    { size: 'default' },
);

const query = defineModel<string>({ required: true });
</script>

<template>
    <label
        class="flex min-w-0 flex-1 items-center gap-2 rounded-md border border-input bg-card px-2.5 shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50"
        :class="size === 'sm' ? 'h-8' : 'h-9'"
    >
        <Search class="size-4 shrink-0 text-muted-foreground" />
        <input
            v-model="query"
            type="search"
            :placeholder="placeholder"
            :aria-label="placeholder"
            class="h-full min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground md:text-sm"
        />
        <span
            v-if="count"
            class="shrink-0 text-xs font-semibold whitespace-nowrap text-muted-foreground tabular-nums"
            >{{ count }}</span
        >
    </label>
</template>
