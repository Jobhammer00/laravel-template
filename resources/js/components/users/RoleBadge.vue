<script setup lang="ts">
import type { BadgeVariants } from '@/components/ui/badge';
import { Badge } from '@/components/ui/badge';

defineProps<{
    role: string;
    label: string;
}>();

const variants: Record<string, BadgeVariants['variant']> = {
    employee: 'outline',
    admin: 'secondary',
};
</script>

<template>
    <Badge :variant="variants[role] ?? 'secondary'">{{ label }}</Badge>
</template>
