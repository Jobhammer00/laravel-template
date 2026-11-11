<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import {
    index as confirmOptions,
    store as confirmStore,
} from '@/actions/Laravel/Passkeys/Http/Controllers/PasskeyConfirmationController';
import InputError from '@/components/InputError.vue';
import PasskeyVerify from '@/components/PasskeyVerify.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import SettingsRow from '@/components/settings/SettingsRow.vue';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/password/confirm';
import { edit } from '@/routes/security';

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
                title="Bevestig dat jij het bent"
                description="Beveiliging is afgeschermd. Bevestig eerst je wachtwoord; dat blijft daarna drie uur geldig."
            >
                <div class="flex max-w-sm flex-col">
                    <PasskeyVerify
                        :routes="{
                            options: confirmOptions(),
                            submit: confirmStore(),
                        }"
                        label="Bevestig met passkey"
                        loading-label="Bevestigen…"
                        separator="Of met je wachtwoord"
                    />

                    <Form
                        v-bind="store.form()"
                        reset-on-success
                        class="flex flex-col gap-3"
                        v-slot="{ errors, processing }"
                    >
                        <div class="grid gap-1.5">
                            <Label for="password">Wachtwoord</Label>
                            <PasswordInput
                                id="password"
                                name="password"
                                required
                                autocomplete="current-password"
                                autofocus
                            />
                            <InputError :message="errors.password" />
                        </div>
                        <div>
                            <Button
                                size="sm"
                                :disabled="processing"
                                data-test="confirm-password-button"
                            >
                                <Spinner v-if="processing" />
                                Bevestigen
                            </Button>
                        </div>
                    </Form>
                </div>
            </SettingsRow>
        </div>
    </div>
</template>
