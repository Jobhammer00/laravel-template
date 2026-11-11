<script setup lang="ts">
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

defineProps<{
    title: string;
    confirmLabel?: string;
    confirmVariant?: 'destructive' | 'default';
    disabled?: boolean;
}>();

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{ confirm: [] }>();

// Confirm before closing: closing first lets the page clear what it deletes.
function confirm(): void {
    emit('confirm');
    open.value = false;
}
</script>

<template>
    <AlertDialog v-model:open="open">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>{{ title }}</AlertDialogTitle>
                <AlertDialogDescription as="div" class="grid gap-2">
                    <slot />
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Annuleren</AlertDialogCancel>
                <Button
                    :variant="confirmVariant ?? 'destructive'"
                    :disabled="disabled"
                    @click="confirm"
                    >{{ confirmLabel ?? 'Verwijderen' }}</Button
                >
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
