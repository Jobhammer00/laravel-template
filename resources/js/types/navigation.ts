import type { InertiaLinkProps } from '@inertiajs/vue3';
import type { LucideIcon } from '@lucide/vue';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon;
    isActive?: boolean;
    activeFor?: NonNullable<InertiaLinkProps['href']>[];
    permission?: App.Enums.Permission;
    /** A red count next to the item, for something that needs fixing there. */
    alert?: number;
};

export type NavGroup = {
    title: string;
    items: NavItem[];
};
