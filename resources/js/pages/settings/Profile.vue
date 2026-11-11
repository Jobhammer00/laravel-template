<script setup lang="ts">
import { Form, Head, Link, usePage } from '@inertiajs/vue3';
import { Check } from '@lucide/vue';
import { computed } from 'vue';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import InputError from '@/components/InputError.vue';
import SettingsRow from '@/components/settings/SettingsRow.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RoleBadge from '@/components/users/RoleBadge.vue';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Instellingen', href: edit() }],
    },
});

const page = usePage();
const user = computed(() => page.props.auth.user);
const rightCount = computed(() => page.props.auth.permissions.length);
</script>

<template>
    <div>
        <Head title="Profiel" />
        <h1 class="sr-only">Profiel</h1>

        <div class="flex flex-col rounded-xl border bg-card px-6">
            <SettingsRow
                title="Persoonlijke gegevens"
                description="Zo zien collega’s je terug in orders, de auditlog en bij toegewezen taken."
            >
                <Form
                    v-bind="ProfileController.update.form()"
                    :options="{ preserveScroll: true, preserveState: true }"
                    set-defaults-on-success
                    class="flex flex-col gap-3"
                    v-slot="{ errors, processing, isDirty, recentlySuccessful }"
                >
                    <div class="grid gap-3 sm:grid-cols-2">
                        <div class="grid gap-1.5">
                            <Label for="name">Naam</Label>
                            <Input
                                id="name"
                                name="name"
                                :default-value="user.name"
                                required
                                autocomplete="name"
                            />
                            <InputError :message="errors.name" />
                        </div>
                        <div class="grid gap-1.5">
                            <Label for="email">E-mailadres</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                :default-value="user.email"
                                required
                                autocomplete="username"
                            />
                            <InputError :message="errors.email" />
                        </div>
                    </div>

                    <div
                        v-if="
                            page.props.mustVerifyEmail &&
                            !user.email_verified_at
                        "
                        class="text-[12.5px] text-muted-foreground"
                    >
                        Je e-mailadres is nog niet bevestigd.
                        <Link
                            :href="send()"
                            as="button"
                            class="font-semibold text-primary"
                            >Stuur de bevestigingsmail opnieuw.</Link
                        >
                        <p
                            v-if="
                                page.props.status === 'verification-link-sent'
                            "
                            class="mt-1 font-semibold text-success"
                        >
                            Er is een nieuwe bevestigingslink naar je
                            e-mailadres gestuurd.
                        </p>
                    </div>

                    <div class="flex items-center gap-2">
                        <Button
                            size="sm"
                            :disabled="processing || !isDirty"
                            data-test="update-profile-button"
                            >Opslaan</Button
                        >
                        <Button
                            v-if="isDirty"
                            type="reset"
                            variant="ghost"
                            size="sm"
                            >Annuleren</Button
                        >
                        <span
                            v-if="recentlySuccessful && !isDirty"
                            class="flex items-center gap-1.5 text-[12.5px] font-semibold text-success"
                        >
                            <Check class="size-3.5" />
                            Opgeslagen
                        </span>
                    </div>
                </Form>
            </SettingsRow>

            <SettingsRow
                title="Rol"
                description="Wordt beheerd door een admin. Vraag een wijziging aan bij een beheerder."
            >
                <div class="flex min-h-5 flex-wrap items-center gap-2.5">
                    <RoleBadge
                        :role="String(user.role)"
                        :label="page.props.auth.roleLabel"
                    />
                    <span class="text-[12.5px] text-muted-foreground"
                        >{{ rightCount }}
                        {{ rightCount === 1 ? 'recht' : 'rechten' }}</span
                    >
                </div>
            </SettingsRow>
        </div>
    </div>
</template>
