<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import { KeyRound } from '@lucide/vue';
import { destroy } from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyRegistrationController';
import PasskeyItem from '@/components/PasskeyItem.vue';
import PasskeyRegister from '@/components/PasskeyRegister.vue';
import SettingsRow from '@/components/settings/SettingsRow.vue';
import type { Passkey } from '@/types/auth';

export type Props = {
    canManagePasskeys?: boolean;
    passkeys?: Passkey[];
};

withDefaults(defineProps<Props>(), {
    canManagePasskeys: false,
    passkeys: () => [],
});

const handleDelete = (id: number, onError: () => void) => {
    router.delete(destroy.url(id), {
        preserveScroll: true,
        onError,
    });
};

const handleRegisterSuccess = () => {
    router.reload();
};
</script>

<template>
    <SettingsRow
        v-if="canManagePasskeys"
        title="Passkeys"
        description="Inloggen zonder wachtwoord, met Touch ID, Face ID of een beveiligingssleutel."
    >
        <template v-if="passkeys.length">
            <div class="overflow-hidden rounded-lg border">
                <PasskeyItem
                    v-for="passkey in passkeys"
                    :key="passkey.id"
                    :passkey="passkey"
                    @remove="handleDelete"
                />
            </div>
            <div class="flex flex-wrap gap-3">
                <PasskeyRegister @success="handleRegisterSuccess" />
            </div>
        </template>

        <div
            v-else
            class="flex flex-wrap items-center gap-3.5 rounded-lg border border-dashed border-input p-3.5"
        >
            <span
                class="flex size-[34px] shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground"
            >
                <KeyRound class="size-4" />
            </span>
            <div class="flex min-w-[180px] flex-1 flex-col">
                <span class="font-bold">Nog geen passkeys</span>
                <span class="text-xs leading-4 text-muted-foreground"
                    >Voeg er een toe om zonder wachtwoord in te loggen.</span
                >
            </div>
            <PasskeyRegister @success="handleRegisterSuccess" />
        </div>
    </SettingsRow>
</template>
