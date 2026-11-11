<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { Construction, FileQuestion, ServerCrash, ShieldX } from '@lucide/vue';
import { computed } from 'vue';
import AppLogo from '@/components/AppLogo.vue';
import EmptyState from '@/components/EmptyState.vue';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/AppLayout.vue';
import { dashboard } from '@/routes';

const props = defineProps<{
    status: 403 | 404 | 500 | 503;
}>();

// A 404 before the session middleware ran has no user: then no app shell.
const page = usePage();
const user = computed(() => page.props.auth?.user ?? null);

const content = computed(
    () =>
        ({
            403: {
                icon: ShieldX,
                title: 'Geen toegang',
                text: 'Je account heeft geen recht op deze pagina. Vraag een beheerder om het recht toe te kennen bij Gebruikers.',
            },
            404: {
                icon: FileQuestion,
                title: 'Pagina niet gevonden',
                text: 'Deze pagina bestaat niet (meer). Controleer de link, of ga terug.',
            },
            500: {
                icon: ServerCrash,
                title: 'Er ging iets mis',
                text: 'Er is een fout opgetreden. Probeer het opnieuw; blijft het gebeuren, meld het dan.',
            },
            503: {
                icon: Construction,
                title: 'Even onderhoud',
                text: 'De beheeromgeving wordt bijgewerkt. Probeer het over een paar minuten opnieuw.',
            },
        })[props.status],
);

function back(): void {
    window.history.back();
}
</script>

<template>
    <AppLayout v-if="user" :breadcrumbs="[]">
        <Head :title="content.title" />
        <div class="px-4 pt-2 pb-8 md:px-7">
            <h1 class="sr-only">{{ content.title }}</h1>
            <EmptyState :icon="content.icon">
                <b class="block text-foreground">{{ content.title }}</b>
                {{ content.text }}
                <span v-if="status === 403" class="mt-1 block"
                    >Ingelogd als <b class="text-foreground">{{ user.email }}</b
                    >.</span
                >
                <template #actions>
                    <div class="flex gap-2">
                        <Button variant="outline" size="sm" @click="back"
                            >← Terug</Button
                        >
                        <Button size="sm" as-child>
                            <Link :href="dashboard()">Naar dashboard</Link>
                        </Button>
                    </div>
                </template>
            </EmptyState>
        </div>
    </AppLayout>

    <div
        v-else
        class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6"
    >
        <Head :title="content.title" />
        <div class="flex items-center gap-2">
            <AppLogo />
        </div>
        <h1 class="sr-only">{{ content.title }}</h1>
        <EmptyState :icon="content.icon" class="w-full max-w-md">
            <b class="block text-foreground">{{ content.title }}</b>
            {{ content.text }}
            <template #actions>
                <Button variant="outline" size="sm" @click="back"
                    >← Terug</Button
                >
            </template>
        </EmptyState>
    </div>
</template>
