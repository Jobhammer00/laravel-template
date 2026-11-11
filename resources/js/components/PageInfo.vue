<script setup lang="ts">
import { Info } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

defineProps<{
    label: string;
}>();
</script>

<template>
    <Popover>
        <PopoverTrigger as-child>
            <Button
                variant="outline"
                size="icon-sm"
                :aria-label="label"
                :title="label"
            >
                <Info />
            </Button>
        </PopoverTrigger>
        <PopoverContent
            align="end"
            class="flex w-[min(380px,calc(100vw-32px))] flex-col gap-2 text-[13px] leading-5 text-pretty"
        >
            <slot />
        </PopoverContent>
    </Popover>
</template>
