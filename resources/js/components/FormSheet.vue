<script setup lang="ts">
import { ref } from 'vue';
import ConfirmDeleteDialog from '@/components/ConfirmDeleteDialog.vue';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

defineProps<{
    title: string;
    /** Read by screen readers only. */
    description: string;
    /** Closing asks first while there are unsaved changes. */
    dirty: boolean;
    processing: boolean;
}>();

const open = defineModel<boolean>('open', { required: true });

const emit = defineEmits<{ submit: [] }>();

const leaving = ref(false);

function close(dirty: boolean): void {
    if (dirty) {
        leaving.value = true;
    } else {
        open.value = false;
    }
}
</script>

<template>
    <Sheet
        :open="open"
        @update:open="(value) => (value ? (open = true) : close(dirty))"
    >
        <SheetContent class="w-full gap-0 bg-card sm:max-w-[440px]">
            <form
                class="flex min-h-0 flex-1 flex-col"
                @submit.prevent="emit('submit')"
            >
                <SheetHeader class="border-b px-5 pt-[18px] pb-3.5">
                    <SheetTitle class="text-base font-extrabold">{{
                        title
                    }}</SheetTitle>
                    <SheetDescription class="sr-only">{{
                        description
                    }}</SheetDescription>
                </SheetHeader>
                <div
                    class="grid flex-1 grid-cols-[minmax(0,1fr)] content-start gap-5 overflow-y-auto px-5 py-[18px]"
                >
                    <slot />
                </div>
                <SheetFooter
                    class="flex-row justify-end gap-2.5 border-t px-5 py-3.5"
                >
                    <Button
                        type="button"
                        variant="outline"
                        @click="close(dirty)"
                        >Annuleren</Button
                    >
                    <Button type="submit" :disabled="processing"
                        >Opslaan</Button
                    >
                </SheetFooter>
            </form>
        </SheetContent>
    </Sheet>

    <ConfirmDeleteDialog
        v-model:open="leaving"
        title="Wijzigingen weggooien?"
        confirm-label="Weggooien"
        @confirm="open = false"
    >
        <p>Je hebt wijzigingen gemaakt die nog niet zijn opgeslagen.</p>
    </ConfirmDeleteDialog>
</template>
