<script setup lang="ts">
import UserAvatar from '@/components/UserAvatar.vue';
import type { User } from '@/types';

defineProps<{
    user: User;
    subtitle?: string;
}>();
</script>

<template>
    <UserAvatar :name="user.name" />

    <div class="grid flex-1 text-left leading-tight">
        <span class="truncate text-[13px] font-bold text-foreground">{{
            user.name
        }}</span>
        <span
            v-if="subtitle"
            class="truncate text-[11.5px] font-medium text-muted-foreground"
            >{{ subtitle }}</span
        >
    </div>
</template>
