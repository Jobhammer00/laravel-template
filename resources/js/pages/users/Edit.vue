<script setup lang="ts">
import { Head, Link, setLayoutProps, useForm, usePage } from '@inertiajs/vue3';
import { Search, Trash2 } from '@lucide/vue';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import InputError from '@/components/InputError.vue';
import PageActions from '@/components/PageActions.vue';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UserAvatar from '@/components/UserAvatar.vue';
import DeleteUserDialog from '@/components/users/DeleteUserDialog.vue';
import { useConfirm } from '@/composables/useConfirm';
import {
    inOrder,
    rightsForRole,
    sameRights,
    setRight,
} from '@/lib/permissions';
import type { ApplyMode } from '@/lib/permissions';
import { create, edit, index, store, update } from '@/routes/users';

const props = defineProps<{
    user: App.Data.UserData | null;
    roles: App.Data.RoleData[];
    permissionGroups: App.Data.PermissionGroupData[];
    canDelete: boolean;
}>();

const title = computed(() => props.user?.name ?? 'Nieuwe gebruiker');

const deleting = ref(false);

// The server refuses it too; saying so on the click beats a refusal at save.
const isSelf = props.user?.id === usePage().props.auth.user.id;
const refuseOwnRights = (): boolean => {
    if (isSelf) {
        toast.error('Je kunt je eigen rol en rechten niet wijzigen.');
    }

    return isSelf;
};

setLayoutProps({
    breadcrumbs: [
        { title: 'User beheer', href: index() },
        {
            title: title.value,
            href: props.user ? edit(props.user.id) : create(),
        },
    ],
});

const roleOf = (value: App.Enums.Role): App.Data.RoleData =>
    props.roles.find((role) => role.value === value) ?? props.roles[0];

// Rights stay in screen order, so toggling one back is not a change.
const order = props.permissionGroups.flatMap((group) =>
    group.permissions.map((permission) => permission.value),
);
const ordered = (permissions: App.Enums.Permission[]) =>
    inOrder(order, permissions);

const initialRole = roleOf(props.user?.role ?? props.roles[0].value);

const form = useForm({
    name: props.user?.name ?? '',
    email: props.user?.email ?? '',
    is_active: props.user?.is_active ?? true,
    role: initialRole.value,
    permissions: ordered(props.user?.permissions ?? initialRole.permissions),
});

const permissionTotal = computed(() =>
    props.permissionGroups.reduce(
        (total, group) => total + group.permissions.length,
        0,
    ),
);

const currentRole = computed(() => roleOf(form.role));
const followsRole = computed(() =>
    sameRights(form.permissions, currentRole.value.permissions),
);

const deviation = computed(() => {
    const extra = form.permissions.filter(
        (permission) => !currentRole.value.permissions.includes(permission),
    ).length;
    const missing = currentRole.value.permissions.filter(
        (permission) => !form.permissions.includes(permission),
    ).length;

    return [
        extra ? `${extra} extra` : '',
        missing ? `${missing} ontbreekt` : '',
    ]
        .filter(Boolean)
        .join(' · ');
});

const {
    target: roleToApply,
    open: applyOpen,
    ask: askApply,
} = useConfirm<App.Data.RoleData>();

function chooseRole(role: App.Data.RoleData): void {
    if (isSelf && (role.value !== form.role || !followsRole.value)) {
        refuseOwnRights();

        return;
    }

    if (followsRole.value && (!props.user || role.value === form.role)) {
        form.role = role.value;
        form.permissions = ordered(role.permissions);

        return;
    }

    askApply(role);
}

function applyRole(mode: ApplyMode): void {
    const role = roleToApply.value;

    if (!role) {
        return;
    }

    form.role = role.value;
    form.permissions = ordered(
        rightsForRole(form.permissions, role.permissions, mode),
    );

    applyOpen.value = false;
}

function setPermission(value: App.Enums.Permission, granted: boolean): void {
    if (refuseOwnRights()) {
        return;
    }

    form.permissions = ordered(setRight(form.permissions, value, granted));
}

const query = ref('');
const visibleGroups = computed(() => {
    const term = query.value.trim().toLowerCase();

    return props.permissionGroups
        .map((group) => ({
            ...group,
            permissions: group.permissions.filter((permission) =>
                permission.label.toLowerCase().includes(term),
            ),
        }))
        .filter((group) => group.permissions.length > 0);
});

function submit(): void {
    // The first error can sit far below the fold, e.g. a right taken from yourself.
    const onError = (errors: Record<string, string>) =>
        toast.error(Object.values(errors)[0]);

    if (props.user) {
        form.put(update.url(props.user.id), { preserveScroll: true, onError });
    } else {
        form.post(store.url(), { onError });
    }
}
</script>

<template>
    <div class="flex flex-col gap-3.5 px-4 pt-2 pb-8 md:px-7">
        <Head :title="title" />
        <h1 class="sr-only">{{ title }}</h1>

        <PageActions>
            <Button
                v-if="canDelete"
                type="button"
                variant="ghost"
                size="sm"
                class="text-destructive hover:bg-destructive/10 hover:text-destructive"
                @click="deleting = true"
            >
                <Trash2 />
                Verwijderen
            </Button>
            <template v-if="form.isDirty">
                <Button variant="outline" size="sm" as-child>
                    <Link :href="index()">Annuleren</Link>
                </Button>
                <Button
                    type="submit"
                    form="user-form"
                    size="sm"
                    :disabled="form.processing"
                    >Opslaan</Button
                >
            </template>
        </PageActions>

        <div v-if="user" class="flex items-center gap-3 pb-1">
            <UserAvatar :name="user.name" :size="44" />
            <div class="flex min-w-0 flex-col">
                <span class="truncate text-[22px] leading-7 font-extrabold">{{
                    user.name
                }}</span>
                <span class="text-[13px] text-muted-foreground">{{
                    roleOf(user.role).label
                }}</span>
            </div>
        </div>

        <form
            id="user-form"
            class="flex flex-col gap-3.5"
            @submit.prevent="submit"
        >
            <div class="grid items-start gap-3.5 lg:grid-cols-2">
                <section
                    class="flex flex-col gap-3 rounded-xl border bg-card p-4"
                >
                    <h2
                        class="text-[13px] font-bold tracking-[0.03em] uppercase"
                    >
                        Gegevens
                    </h2>

                    <div class="grid gap-1.5">
                        <Label for="name">Naam</Label>
                        <Input
                            id="name"
                            v-model="form.name"
                            required
                            autocomplete="off"
                            placeholder="Voor- en achternaam"
                        />
                        <InputError :message="form.errors.name" />
                    </div>

                    <div class="grid gap-1.5">
                        <Label for="email">E-mailadres</Label>
                        <Input
                            id="email"
                            v-model="form.email"
                            type="email"
                            required
                            autocomplete="off"
                            placeholder="naam@example.com"
                        />
                        <InputError :message="form.errors.email" />
                        <p v-if="!user" class="text-xs text-muted-foreground">
                            De gebruiker krijgt op dit adres een uitnodiging om
                            een wachtwoord in te stellen.
                        </p>
                    </div>

                    <div class="grid gap-1.5">
                        <Label
                            for="is_active"
                            class="flex w-fit cursor-pointer items-center gap-2.5 text-[13px] font-semibold"
                        >
                            <Checkbox id="is_active" v-model="form.is_active" />
                            Account is actief
                        </Label>
                        <InputError :message="form.errors.is_active" />
                    </div>
                </section>

                <section
                    class="flex flex-col gap-3 rounded-xl border bg-card p-4"
                >
                    <h2
                        id="role-heading"
                        class="text-[13px] font-bold tracking-[0.03em] uppercase"
                    >
                        Rol
                    </h2>
                    <div
                        role="radiogroup"
                        aria-labelledby="role-heading"
                        class="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2"
                    >
                        <button
                            v-for="role in roles"
                            :key="role.value"
                            type="button"
                            role="radio"
                            :aria-checked="form.role === role.value"
                            class="group flex flex-col items-start gap-0.5 rounded-md border px-3 py-2.5 text-left transition-colors hover:bg-muted aria-checked:border-primary aria-checked:bg-primary-muted"
                            @click="chooseRole(role)"
                        >
                            <span
                                class="text-[13px] font-bold text-foreground group-aria-checked:text-primary"
                                >{{ role.label }}</span
                            >
                            <span
                                class="text-[11.5px] text-muted-foreground group-aria-checked:text-primary"
                                >{{ role.tag }}</span
                            >
                        </button>
                    </div>
                    <InputError :message="form.errors.role" />
                </section>
            </div>

            <section
                class="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4"
            >
                <div
                    class="flex flex-wrap items-center justify-between gap-2.5"
                >
                    <h2
                        class="text-[13px] font-bold tracking-[0.03em] uppercase"
                    >
                        Rechten per functionaliteit
                    </h2>
                    <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        class="text-primary"
                        :disabled="followsRole"
                        :title="
                            followsRole
                                ? 'De rechten volgen de rol al'
                                : undefined
                        "
                        @click="!refuseOwnRights() && askApply(currentRole)"
                        >Toepassen volgens rol</Button
                    >
                </div>

                <p
                    class="-mt-1.5 text-[12.5px] leading-[19px] text-pretty text-muted-foreground"
                >
                    Rechten zijn beschrijvend,
                    <b class="text-foreground">binair</b> (wel of geen recht) en
                    gelden per <b class="text-foreground">functionaliteit</b>,
                    niet per scherm. Waar inzage zelf een recht is, is dat een
                    eigen bekijken-recht; een beheren-recht omvat het bekijken.
                    Standaard volgt dit de rol; per gebruiker kun je afwijken.
                </p>

                <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <div class="relative w-full max-w-[340px]">
                        <Search
                            class="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            v-model="query"
                            type="search"
                            placeholder="Zoek op functionaliteit…"
                            aria-label="Zoek op functionaliteit"
                            class="pl-8"
                        />
                    </div>
                    <span class="text-[12.5px] text-muted-foreground"
                        ><b class="text-foreground tabular-nums"
                            >{{ form.permissions.length }} van
                            {{ permissionTotal }}</b
                        >
                        rechten toegekend</span
                    >
                    <Badge v-if="deviation" variant="outline"
                        >Wijkt af van {{ currentRole.label }}:
                        {{ deviation }}</Badge
                    >
                </div>

                <p
                    v-if="visibleGroups.length === 0"
                    class="py-6 text-center text-[12.5px] text-muted-foreground"
                >
                    Geen functionaliteit gevonden voor „{{ query.trim() }}”.
                </p>

                <div
                    v-for="group in visibleGroups"
                    :key="group.value"
                    class="flex flex-col gap-1.5"
                >
                    <h3
                        class="pt-1.5 text-[10.5px] font-bold tracking-[0.08em] text-muted-foreground uppercase"
                    >
                        {{ group.label }}
                    </h3>
                    <Label
                        v-for="permission in group.permissions"
                        :key="permission.value"
                        :for="`permission-${permission.value}`"
                        class="flex cursor-pointer items-center justify-between gap-3 rounded-md border bg-card px-3 py-2.5 has-data-[state=checked]:border-primary-border has-data-[state=checked]:bg-primary-muted"
                    >
                        <span class="flex flex-col gap-0.5">
                            <span class="text-[13.5px] font-bold">{{
                                permission.label
                            }}</span>
                            <span
                                class="text-[11.5px] font-normal text-muted-foreground"
                                >{{
                                    form.permissions.includes(permission.value)
                                        ? 'recht toegekend'
                                        : 'geen recht'
                                }}</span
                            >
                        </span>
                        <Checkbox
                            :id="`permission-${permission.value}`"
                            :model-value="
                                form.permissions.includes(permission.value)
                            "
                            @update:model-value="
                                setPermission(permission.value, $event === true)
                            "
                        />
                    </Label>
                </div>
                <InputError :message="form.errors.permissions" />
            </section>
        </form>
        <AlertDialog v-model:open="applyOpen">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle
                        >Rechten volgens
                        {{ roleToApply?.label }}</AlertDialogTitle
                    >
                    <AlertDialogDescription>
                        Je past de rechten van deze gebruiker aan. Overschrijven
                        maakt ze gelijk aan de rol; aanvullen zet alleen
                        ontbrekende rechten van de rol erbij en laat de rest
                        staan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Niets wijzigen</AlertDialogCancel>
                    <Button variant="outline" @click="applyRole('merge')"
                        >Alleen aanvullen</Button
                    >
                    <Button @click="applyRole('overwrite')"
                        >Alles overschrijven</Button
                    >
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <DeleteUserDialog v-if="user" v-model:open="deleting" :user="user" />
    </div>
</template>
