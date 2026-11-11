<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Plus } from '@lucide/vue';
import { computed } from 'vue';
import PageHeader from '@/components/PageHeader.vue';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import UserAvatar from '@/components/UserAvatar.vue';
import RoleBadge from '@/components/users/RoleBadge.vue';
import StatusBadge from '@/components/users/StatusBadge.vue';
import { sameRights } from '@/lib/permissions';
import { create, edit } from '@/routes/users';

const props = defineProps<{
    users: App.Data.UserData[];
    permissionTotal: number;
    roles: App.Data.RoleData[];
}>();

defineOptions({ layout: { breadcrumbs: [] } });

const rolesByValue = computed(
    () => new Map(props.roles.map((role) => [role.value, role])),
);

const deviates = (user: App.Data.UserData): boolean =>
    !sameRights(
        user.permissions,
        rolesByValue.value.get(user.role)?.permissions ?? [],
    );
</script>

<template>
    <div class="flex flex-col gap-3 px-4 pt-2 pb-8 md:px-7 md:pt-7">
        <Head title="User beheer" />

        <PageHeader title="User beheer">
            <Button size="sm" as-child>
                <Link :href="create()">
                    <Plus />
                    Gebruiker toevoegen
                </Link>
            </Button>
        </PageHeader>

        <div class="overflow-hidden rounded-xl border bg-card">
            <Table class="text-sm">
                <TableHeader class="bg-muted">
                    <TableRow class="hover:bg-transparent">
                        <TableHead
                            v-for="column in [
                                'Gebruiker',
                                'Rol',
                                'Rechten',
                                'Status',
                            ]"
                            :key="column"
                            class="h-auto px-4 py-3 text-[11px] leading-4 font-bold tracking-[0.06em] uppercase"
                            >{{ column }}</TableHead
                        >
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow
                        v-for="user in users"
                        :key="user.id"
                        class="relative hover:bg-muted"
                    >
                        <TableCell class="px-4 py-3">
                            <div class="flex items-center gap-3">
                                <UserAvatar :name="user.name" />
                                <div class="grid leading-tight">
                                    <Link
                                        :href="edit(user.id)"
                                        class="font-bold text-foreground after:absolute after:inset-0 hover:no-underline"
                                        >{{ user.name }}</Link
                                    >
                                    <span class="text-xs text-muted-foreground">
                                        {{ user.email }}
                                    </span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell class="px-4 py-3">
                            <RoleBadge
                                :role="user.role"
                                :label="
                                    rolesByValue.get(user.role)?.label ??
                                    user.role
                                "
                            />
                        </TableCell>
                        <TableCell class="px-4 py-3 tabular-nums">
                            {{ user.permissions.length }} van
                            {{ permissionTotal }} rechten
                            <span
                                v-if="deviates(user)"
                                class="text-[11px] font-bold text-warning"
                                title="Wijkt af van de standaardrechten van de rol"
                                >· afwijkend</span
                            >
                        </TableCell>
                        <TableCell class="px-4 py-3">
                            <StatusBadge :active="user.is_active" />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>
