<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { CircleCheck } from '@lucide/vue';
import SettingsRow from '@/components/settings/SettingsRow.vue';
import { useAppearance } from '@/composables/useAppearance';
import { edit } from '@/routes/appearance';
import type { Appearance } from '@/types';

defineOptions({
    layout: {
        breadcrumbs: [{ title: 'Instellingen', href: edit() }],
    },
});

const { appearance, updateAppearance } = useAppearance();

const themes: { value: Appearance; label: string; halves: string[] }[] = [
    { value: 'light', label: 'Licht', halves: ['light'] },
    { value: 'dark', label: 'Donker', halves: ['dark'] },
    { value: 'system', label: 'Systeem', halves: ['light', 'dark'] },
];
</script>

<template>
    <div>
        <Head title="Weergave" />
        <h1 class="sr-only">Weergave</h1>

        <div class="flex flex-col rounded-xl border bg-card px-6">
            <SettingsRow
                title="Thema"
                description="Kies hoe de beheeromgeving eruitziet. Je keuze wordt op dit apparaat onthouden."
            >
                <div
                    role="radiogroup"
                    aria-label="Thema"
                    class="grid grid-cols-3 gap-2.5 sm:max-w-[420px]"
                >
                    <button
                        v-for="theme in themes"
                        :key="theme.value"
                        type="button"
                        role="radio"
                        :aria-checked="appearance === theme.value"
                        class="flex flex-col gap-1.5 rounded-lg border-2 bg-card px-1.5 pt-1.5 pb-2 text-left transition-colors aria-checked:border-primary"
                        @click="updateAppearance(theme.value)"
                    >
                        <span
                            class="flex h-[60px] overflow-hidden rounded-md border"
                        >
                            <span
                                v-for="half in theme.halves"
                                :key="half"
                                :class="half"
                                class="flex flex-1 gap-[5px] bg-background p-1.5"
                            >
                                <span
                                    class="flex w-[28%] flex-col gap-1 rounded-sm bg-sidebar px-[5px] py-1.5"
                                >
                                    <span
                                        class="h-1 rounded-xs bg-sidebar-accent-foreground/60"
                                    />
                                    <span
                                        class="h-1 w-[70%] rounded-xs bg-input"
                                    />
                                    <span
                                        class="h-1 w-[80%] rounded-xs bg-input"
                                    />
                                </span>
                                <span
                                    class="flex flex-1 flex-col gap-1 rounded-sm bg-card p-1.5"
                                >
                                    <span
                                        class="h-[5px] w-1/2 rounded-xs bg-foreground"
                                    />
                                    <span
                                        class="h-1 w-[80%] rounded-xs bg-input"
                                    />
                                    <span
                                        class="mt-auto h-2.5 w-[34%] rounded-[3px] bg-primary"
                                    />
                                </span>
                            </span>
                        </span>
                        <span
                            class="flex items-center justify-between px-0.5 text-[12.5px] font-bold"
                        >
                            {{ theme.label }}
                            <CircleCheck
                                v-if="appearance === theme.value"
                                class="size-4 text-primary"
                            />
                        </span>
                    </button>
                </div>
            </SettingsRow>
        </div>
    </div>
</template>
