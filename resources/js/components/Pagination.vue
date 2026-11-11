<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Button } from '@/components/ui/button';
import type { Paginated } from '@/types';

defineProps<{
    paginator: Paginated<unknown>;
}>();

const number = new Intl.NumberFormat('nl-NL');
</script>

<template>
    <nav
        v-if="paginator.total > 0"
        class="flex items-center justify-between gap-2.5 text-[12.5px] text-muted-foreground"
        aria-label="Paginering"
    >
        <span class="tabular-nums"
            >{{ number.format(paginator.from ?? 0) }}–{{
                number.format(paginator.to ?? 0)
            }}
            van {{ number.format(paginator.total) }}</span
        >
        <div class="flex items-center gap-2">
            <Button
                variant="outline"
                size="xs"
                :disabled="!paginator.prev_page_url"
                :as-child="!!paginator.prev_page_url"
            >
                <Link
                    v-if="paginator.prev_page_url"
                    :href="paginator.prev_page_url"
                    >‹ Vorige</Link
                >
                <template v-else>‹ Vorige</template>
            </Button>
            <span class="tabular-nums"
                >Pagina {{ paginator.current_page }} /
                {{ paginator.last_page }}</span
            >
            <Button
                variant="outline"
                size="xs"
                :disabled="!paginator.next_page_url"
                :as-child="!!paginator.next_page_url"
            >
                <Link
                    v-if="paginator.next_page_url"
                    :href="paginator.next_page_url"
                    >Volgende ›</Link
                >
                <template v-else>Volgende ›</template>
            </Button>
        </div>
    </nav>
</template>
