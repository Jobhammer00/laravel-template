<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import InputError from '@/components/InputError.vue';
import {
    NumberField,
    NumberFieldContent,
    NumberFieldInput,
} from '@/components/ui/number-field';

const props = defineProps<{
    /** 0 for a whole number. */
    decimals: number;
    id?: string;
    placeholder?: string;
}>();

const model = defineModel<number | null | undefined>();

const refused = ref<string>();

const formatOptions = computed(() => ({
    maximumFractionDigits: props.decimals,
    useGrouping: false,
}));

watch(
    () => props.decimals,
    () => (refused.value = undefined),
);

/**
 * nl-NL reads a dot as a thousands separator, so 2.5 would silently become 25.
 * Grouping is off, so a dot can only mean the decimal comma. Runs in the capture
 * phase, before Reka validates the input.
 */
function beforeInput(event: InputEvent): void {
    const text = event.data;
    const input = event.target as HTMLInputElement;

    // The message stays until the user corrects the value, else 12,5 still ends up as 125 unnoticed.
    if (
        event.inputType.startsWith('delete') ||
        input.selectionStart !== input.selectionEnd
    ) {
        refused.value = undefined;
    }

    if (!text || !/[.,]/.test(text)) {
        return;
    }

    if (props.decimals === 0) {
        event.preventDefault();
        event.stopPropagation();
        refused.value = 'Een geheel getal heeft geen decimalen.';

        return;
    }

    if (!text.includes('.')) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    insert(input, text.replaceAll('.', ','));
}

function insert(input: HTMLInputElement, text: string): void {
    // A native insert keeps undo and lets Reka validate the comma.
    if (document.execCommand?.('insertText', false, text)) {
        return;
    }

    input.setRangeText(
        text,
        input.selectionStart ?? input.value.length,
        input.selectionEnd ?? input.value.length,
        'end',
    );
    input.dispatchEvent(new Event('input', { bubbles: true }));
}
</script>

<template>
    <div class="grid gap-2" @beforeinput.capture="beforeInput">
        <NumberField
            :id="id"
            v-model="model"
            locale="nl-NL"
            :format-options="formatOptions"
            :step-snapping="false"
            disable-wheel-change
        >
            <NumberFieldContent>
                <NumberFieldInput :placeholder="placeholder" />
            </NumberFieldContent>
        </NumberField>
        <InputError :message="refused" />
    </div>
</template>
