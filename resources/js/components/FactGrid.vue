<script setup lang="ts">
// A row of facts under a detail: plan, project, waiting time, cost.
defineProps<{ facts: { label: string; value: string; mono?: boolean }[] }>();
</script>

<template>
    <dl
        class="bg-line m-0 grid grid-cols-2 gap-px overflow-hidden rounded-xl sm:grid-cols-4"
    >
        <div
            v-for="fact in facts"
            :key="fact.label"
            class="bg-subtle min-w-0 px-3 py-2.5"
        >
            <dt class="mb-0.5 text-xs text-muted-foreground">
                {{ fact.label }}
            </dt>
            <dd
                class="m-0 truncate text-[13.5px] font-medium"
                :class="{ 'font-mono': fact.mono }"
            >
                {{ fact.value }}
            </dd>
        </div>
    </dl>
</template>
