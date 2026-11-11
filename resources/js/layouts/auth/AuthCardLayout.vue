<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

defineProps<{
    title?: string;
    description?: string;
}>();
</script>

<template>
    <div
        class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10"
    >
        <div class="flex w-full max-w-sm flex-col gap-6">
            <div class="flex items-center gap-2.5 self-center">
                <AppLogo />
            </div>

            <Card class="gap-6 rounded-xl py-6 shadow-sm">
                <CardHeader class="gap-1.5 px-6 text-center">
                    <CardTitle class="text-xl font-bold tracking-tight">{{
                        title
                    }}</CardTitle>
                    <CardDescription class="text-[13px] text-pretty">
                        {{ description }}
                    </CardDescription>
                </CardHeader>
                <CardContent class="px-6">
                    <slot />
                </CardContent>
            </Card>
        </div>
    </div>
</template>
