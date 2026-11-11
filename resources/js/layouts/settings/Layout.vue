<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Lock, Palette, User } from '@lucide/vue';
import { useCurrentUrl } from '@/composables/useCurrentUrl';
import { toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';

const items = [
    {
        title: 'Profiel',
        description: 'Naam en e-mailadres',
        href: editProfile(),
        icon: User,
    },
    {
        title: 'Beveiliging',
        description: 'Wachtwoord en 2FA',
        href: editSecurity(),
        icon: Lock,
    },
    {
        title: 'Weergave',
        description: 'Licht, donker of systeem',
        href: editAppearance(),
        icon: Palette,
    },
];

const { isCurrentOrParentUrl } = useCurrentUrl();
</script>

<template>
    <div
        class="grid max-w-[1160px] items-start gap-4 px-4 pt-2 pb-8 md:grid-cols-[240px_minmax(0,1fr)] md:px-7"
    >
        <nav
            aria-label="Instellingen"
            class="flex gap-0.5 overflow-x-auto rounded-xl border bg-card p-1.5 md:sticky md:top-16 md:flex-col"
        >
            <Link
                v-for="item in items"
                :key="toUrl(item.href)"
                :href="item.href"
                :aria-current="
                    isCurrentOrParentUrl(item.href) ? 'page' : undefined
                "
                class="group flex shrink-0 items-start gap-2.5 rounded-md border border-transparent px-2.5 py-[9px] text-foreground transition-colors hover:bg-muted hover:no-underline aria-[current=page]:border-primary-border aria-[current=page]:bg-primary-muted"
            >
                <component
                    :is="item.icon"
                    class="mt-0.5 size-4 shrink-0 text-muted-foreground group-aria-[current=page]:text-primary"
                />
                <span class="flex min-w-0 flex-col">
                    <span
                        class="text-[13px] leading-5 font-bold group-aria-[current=page]:text-primary"
                        >{{ item.title }}</span
                    >
                    <span
                        class="hidden text-xs leading-4 text-muted-foreground md:block"
                        >{{ item.description }}</span
                    >
                </span>
            </Link>
        </nav>

        <div class="flex min-w-0 flex-col gap-2.5">
            <slot />
        </div>
    </div>
</template>
