<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import SecurityController from '@/actions/App/Http/Controllers/Settings/SecurityController';
import InputError from '@/components/InputError.vue';
import type { Props as ManagePasskeysProps } from '@/components/ManagePasskeys.vue';
import ManagePasskeys from '@/components/ManagePasskeys.vue';
import type { Props as ManageTwoFactorProps } from '@/components/ManageTwoFactor.vue';
import ManageTwoFactor from '@/components/ManageTwoFactor.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import SettingsRow from '@/components/settings/SettingsRow.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { edit } from '@/routes/security';

// oxfmt-ignore
type Props = {
    passwordRules: string;
} & ManagePasskeysProps &
    ManageTwoFactorProps;

const props = defineProps<Props>();

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Instellingen', href: edit() }],
    },
});
</script>

<template>
    <div>
        <Head title="Beveiliging" />
        <h1 class="sr-only">Beveiliging</h1>

        <div class="flex flex-col rounded-xl border bg-card px-6">
            <SettingsRow
                title="Wachtwoord"
                description="Kies een lang, willekeurig wachtwoord. Je blijft ingelogd op dit apparaat."
            >
                <Form
                    v-bind="SecurityController.update.form()"
                    :options="{ preserveScroll: true }"
                    reset-on-success
                    :reset-on-error="[
                        'password',
                        'password_confirmation',
                        'current_password',
                    ]"
                    class="flex flex-col gap-3"
                    v-slot="{ errors, processing }"
                >
                    <div class="grid gap-1.5">
                        <Label for="current_password">Huidig wachtwoord</Label>
                        <PasswordInput
                            id="current_password"
                            name="current_password"
                            autocomplete="current-password"
                        />
                        <InputError :message="errors.current_password" />
                    </div>
                    <div class="grid gap-3 sm:grid-cols-2">
                        <div class="grid gap-1.5">
                            <Label for="password">Nieuw wachtwoord</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                autocomplete="new-password"
                                :passwordrules="props.passwordRules"
                            />
                            <InputError :message="errors.password" />
                        </div>
                        <div class="grid gap-1.5">
                            <Label for="password_confirmation"
                                >Herhaal nieuw wachtwoord</Label
                            >
                            <PasswordInput
                                id="password_confirmation"
                                name="password_confirmation"
                                autocomplete="new-password"
                                :passwordrules="props.passwordRules"
                            />
                            <InputError
                                :message="errors.password_confirmation"
                            />
                        </div>
                    </div>
                    <div>
                        <Button
                            size="sm"
                            :disabled="processing"
                            data-test="update-password-button"
                            >Wachtwoord wijzigen</Button
                        >
                    </div>
                </Form>
            </SettingsRow>

            <ManageTwoFactor
                :canManageTwoFactor="canManageTwoFactor"
                :requiresConfirmation="requiresConfirmation"
                :twoFactorEnabled="twoFactorEnabled"
            />

            <ManagePasskeys
                :canManagePasskeys="canManagePasskeys"
                :passkeys="passkeys"
            />
        </div>
    </div>
</template>
