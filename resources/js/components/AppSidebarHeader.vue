<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ArrowLeft } from '@lucide/vue';
import { computed } from 'vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem } from '@/types';

const props = withDefaults(
    defineProps<{
        breadcrumbs?: BreadcrumbItem[];
    }>(),
    {
        breadcrumbs: () => [],
    },
);

const back = computed(() =>
    props.breadcrumbs.length > 1
        ? props.breadcrumbs[props.breadcrumbs.length - 2]
        : null,
);
</script>

<template>
    <header
        class="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-4 bg-background px-4 md:px-7"
        :class="{ 'md:hidden': breadcrumbs.length === 0 && !back }"
    >
        <div
            class="flex shrink-0 items-center gap-1"
            :class="{ '-ml-2': back }"
        >
            <SidebarTrigger class="md:hidden" />
            <Button
                v-if="back"
                variant="ghost"
                size="icon-sm"
                as-child
                aria-label="Terug"
                title="Terug"
            >
                <Link :href="back.href"><ArrowLeft /></Link>
            </Button>
            <Breadcrumbs
                v-if="breadcrumbs.length > 0"
                :breadcrumbs="breadcrumbs"
            />
        </div>
        <div
            id="page-actions"
            class="flex min-w-0 flex-auto items-center justify-end gap-2"
        />
    </header>
</template>
