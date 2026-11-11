<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import EmptyState from '@/components/EmptyState.vue';
import PageHeader from '@/components/PageHeader.vue';

defineOptions({ layout: { breadcrumbs: [] } });
</script>

<template>
    <div class="flex flex-col gap-[18px] px-4 pt-2 pb-8 md:px-7 md:pt-7">
        <Head title="Dashboard" />
        <PageHeader title="Dashboard" />
        <EmptyState>Nog niets te zien.</EmptyState>
    </div>
</template>
