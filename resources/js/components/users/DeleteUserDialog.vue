<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import { destroy } from '@/routes/users';

const props = defineProps<{
    user: { id: number; name: string };
}>();

const open = defineModel<boolean>('open', { required: true });

function remove(): void {
    router.delete(destroy.url(props.user.id), { preserveScroll: true });
}
</script>

<template>
    <ConfirmDeleteDialog
        v-model:open="open"
        :title="`${user.name} verwijderen?`"
        @confirm="remove"
    >
        <p>
            De gebruiker kan niet meer inloggen en verdwijnt uit het overzicht.
            Eerdere acties blijven herleidbaar.
        </p>
    </ConfirmDeleteDialog>
</template>
