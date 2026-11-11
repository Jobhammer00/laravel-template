<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ChevronDown } from '@lucide/vue';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import type { NavGroup, NavItem } from '@/types';

defineProps<{
    groups: NavGroup[];
}>();

const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();

// Trailing slash: /users must not light up on /users-export.
const isActive = (href: NavItem['href']): boolean =>
    isCurrentUrl(href) || isCurrentOrParentUrl(`${toUrl(href)}/`);
</script>

<template>
    <Collapsible
        v-for="group in groups"
        :key="group.title"
        default-open
        class="group/collapsible"
    >
        <SidebarGroup class="px-2.5 py-0">
            <SidebarGroupLabel
                as-child
                class="h-[26px] px-2.5 text-[10.5px] font-bold tracking-[0.08em] text-muted-foreground uppercase group-data-[collapsible=icon]:invisible"
            >
                <CollapsibleTrigger
                    class="flex w-full items-center justify-between"
                >
                    {{ group.title }}
                    <ChevronDown
                        class="size-3 transition-transform group-data-[state=closed]/collapsible:-rotate-90"
                    />
                </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
                <SidebarMenu class="gap-px">
                    <SidebarMenuItem
                        v-for="item in group.items"
                        :key="item.title"
                        class="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center"
                    >
                        <SidebarMenuButton
                            as-child
                            :is-active="
                                [item.href, ...(item.activeFor ?? [])].some(
                                    isActive,
                                )
                            "
                            :tooltip="item.title"
                            class="h-8 gap-2.5 px-3 text-[13px] font-semibold text-sidebar-foreground hover:bg-secondary hover:text-sidebar-foreground data-[active=true]:font-semibold data-[active=true]:hover:bg-sidebar-accent data-[active=true]:hover:text-sidebar-accent-foreground [&>svg]:text-muted-foreground data-[active=true]:[&>svg]:text-sidebar-accent-foreground"
                        >
                            <Link :href="item.href">
                                <component :is="item.icon" />
                                <span>{{ item.title }}</span>
                            </Link>
                        </SidebarMenuButton>
                        <SidebarMenuBadge
                            v-if="item.alert"
                            class="bg-destructive-muted text-destructive peer-hover/menu-button:text-destructive peer-data-[active=true]/menu-button:text-destructive"
                            :title="`${item.alert} met een probleem`"
                            >{{ item.alert }}</SidebarMenuBadge
                        >
                    </SidebarMenuItem>
                </SidebarMenu>
            </CollapsibleContent>
        </SidebarGroup>
    </Collapsible>
</template>
