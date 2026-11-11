<script setup lang="ts">
import { usePasskeyRegister } from '@laravel/passkeys/vue';
import { Plus } from '@lucide/vue';
import { ref } from 'vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const emit = defineEmits<{
    success: [];
}>();

const getDefaultPasskeyName = () => {
    const ua = navigator.userAgent;

    const browser = [
        { pattern: /Edg|Edge/, name: 'Edge' },
        { pattern: /OPR|Opera|OPiOS/, name: 'Opera' },
        { pattern: /Firefox|FxiOS/, name: 'Firefox' },
        { pattern: /Chrome|CriOS/, name: 'Chrome' },
        { pattern: /Safari/, name: 'Safari' },
    ].find(({ pattern }) => pattern.test(ua))?.name;

    const os = [
        { pattern: /iPhone/, name: 'iPhone' },
        { pattern: /iPad|Macintosh(?=.*Mobile)/, name: 'iPad' },
        { pattern: /Android/, name: 'Android' },
        { pattern: /Mac/, name: 'Mac' },
        { pattern: /Windows/, name: 'Windows' },
    ].find(({ pattern }) => pattern.test(ua))?.name;

    return [browser, os].filter(Boolean).join(' on ') || '';
};

const name = ref(getDefaultPasskeyName());
const showForm = ref(false);

const { register, isLoading, error, isSupported } = usePasskeyRegister({
    onSuccess: () => {
        name.value = '';
        showForm.value = false;
        emit('success');
    },
});

const handleSubmit = async (event: Event) => {
    event.preventDefault();

    if (!name.value.trim()) {
        return;
    }

    await register(name.value);
};

const handleCancel = () => {
    showForm.value = false;
    name.value = '';
};
</script>

<template>
    <Button
        v-if="!isSupported"
        variant="outline"
        size="sm"
        disabled
        title="Deze browser ondersteunt geen passkeys. Probeer Chrome, Safari of Edge."
    >
        <Plus />Passkey toevoegen
    </Button>

    <Button
        v-else-if="!showForm"
        variant="outline"
        size="sm"
        @click="showForm = true"
    >
        <Plus />Passkey toevoegen
    </Button>

    <form
        v-else
        @submit="handleSubmit"
        class="basis-full space-y-3 rounded-lg border bg-muted p-4"
    >
        <div class="grid gap-2">
            <Label for="passkey-name">Naam van de passkey</Label>
            <Input
                id="passkey-name"
                type="text"
                v-model="name"
                placeholder="Bijv. MacBook Pro, iPhone"
                class="block w-full bg-card"
                autofocus
            />
            <p class="text-xs text-muted-foreground">
                Zo herken je deze passkey later terug.
            </p>
        </div>

        <InputError v-if="error" :message="error" />

        <div class="flex gap-2">
            <Button
                type="submit"
                size="sm"
                :disabled="isLoading || !name.trim()"
            >
                {{ isLoading ? 'Bezig…' : 'Passkey registreren' }}
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                @click="handleCancel"
            >
                Annuleren
            </Button>
        </div>
    </form>
</template>
