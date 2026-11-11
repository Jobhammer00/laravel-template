<script setup lang="ts">
import { Form } from '@inertiajs/vue3';
import { ShieldCheck, Smartphone } from '@lucide/vue';
import { onUnmounted, ref } from 'vue';
import SettingsRow from '@/components/settings/SettingsRow.vue';
import TwoFactorRecoveryCodes from '@/components/TwoFactorRecoveryCodes.vue';
import TwoFactorSetupModal from '@/components/TwoFactorSetupModal.vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';
import { disable, enable } from '@/routes/two-factor';

export type Props = {
    canManageTwoFactor?: boolean;
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

withDefaults(defineProps<Props>(), {
    canManageTwoFactor: false,
    requiresConfirmation: false,
    twoFactorEnabled: false,
});

const { hasSetupData, clearTwoFactorAuthData } = useTwoFactorAuth();
const showSetupModal = ref<boolean>(false);

onUnmounted(() => clearTwoFactorAuthData());
</script>

<template>
    <SettingsRow
        v-if="canManageTwoFactor"
        title="Tweestapsverificatie"
        description="Extra controle met een code uit een authenticator-app bij het inloggen."
    >
        <div
            class="flex flex-wrap items-center justify-between gap-4 rounded-lg border px-3.5 py-3"
        >
            <div class="flex min-w-0 items-center gap-3">
                <span
                    class="flex size-[34px] shrink-0 items-center justify-center rounded-md"
                    :class="
                        twoFactorEnabled
                            ? 'bg-success-muted text-success'
                            : 'bg-muted text-muted-foreground'
                    "
                >
                    <ShieldCheck v-if="twoFactorEnabled" class="size-4" />
                    <Smartphone v-else class="size-4" />
                </span>
                <div class="flex min-w-0 flex-col">
                    <span class="flex items-center gap-2 font-bold">
                        Authenticator-app
                        <Badge
                            :variant="
                                twoFactorEnabled ? 'default' : 'secondary'
                            "
                            >{{ twoFactorEnabled ? 'Aan' : 'Uit' }}</Badge
                        >
                    </span>
                    <span class="text-xs leading-4 text-muted-foreground">{{
                        twoFactorEnabled
                            ? 'Bij het inloggen vragen we een code uit je app.'
                            : 'Bij het inloggen vragen we een code van je telefoon.'
                    }}</span>
                </div>
            </div>

            <Form
                v-if="twoFactorEnabled"
                v-bind="disable.form()"
                #default="{ processing }"
            >
                <Button
                    type="submit"
                    variant="outline"
                    size="sm"
                    :disabled="processing"
                    >Uitzetten</Button
                >
            </Form>
            <Button
                v-else-if="hasSetupData"
                size="sm"
                @click="showSetupModal = true"
                >Instellen afronden</Button
            >
            <Form
                v-else
                v-bind="enable.form()"
                @success="showSetupModal = true"
                #default="{ processing }"
            >
                <Button type="submit" size="sm" :disabled="processing"
                    >Aanzetten</Button
                >
            </Form>
        </div>

        <TwoFactorRecoveryCodes v-if="twoFactorEnabled" />

        <TwoFactorSetupModal
            v-model:isOpen="showSetupModal"
            :requiresConfirmation="requiresConfirmation"
            :twoFactorEnabled="twoFactorEnabled"
        />
    </SettingsRow>
</template>
