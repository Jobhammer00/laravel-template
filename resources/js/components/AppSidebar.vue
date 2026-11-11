<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { LayoutDashboard, Users } from '@lucide/vue';
import { computed } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
import NavMain from '@/components/NavMain.vue';
import NavUser from '@/components/NavUser.vue';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { visibleNavGroups as filterNavGroups } from '@/lib/permissions';
import { dashboard } from '@/routes';
import { index as users } from '@/routes/users';
import type { NavGroup } from '@/types';

const page = usePage();

const navGroups = computed((): NavGroup[] => [
    {
        title: 'Algemeen',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutDashboard,
            },
            {
                title: 'User beheer',
                href: users(),
                icon: Users,
                permission: 'manage_users',
            },
        ],
    },
]);

const visibleNavGroups = computed(() =>
    filterNavGroups(navGroups.value, page.props.auth.permissions),
);
</script>

<template>
    <Sidebar collapsible="icon" variant="sidebar">
        <SidebarHeader
            class="h-14 flex-row items-center gap-2.5 px-[18px] py-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
            <Link
                :href="dashboard()"
                class="flex flex-1 items-center gap-2.5 group-data-[collapsible=icon]:hidden"
            >
                <AppLogo />
            </Link>
            <SidebarTrigger
                class="size-8 text-muted-foreground"
                aria-label="Sidebar in-/uitklappen"
                title="Sidebar in-/uitklappen"
            />
        </SidebarHeader>

        <SidebarContent class="gap-2 py-2.5">
            <NavMain :groups="visibleNavGroups" />
        </SidebarContent>

        <SidebarFooter class="p-2.5">
            <NavUser />
        </SidebarFooter>
    </Sidebar>
    <slot />
</template>
