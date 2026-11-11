<script setup lang="ts">
import { parseDate } from '@internationalized/date';
import type { DateValue } from '@internationalized/date';
import { CalendarDays, ChevronLeft, ChevronRight, X } from '@lucide/vue';
import {
    CalendarCell,
    CalendarCellTrigger,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHead,
    CalendarGridRow,
    CalendarHeadCell,
    CalendarHeader,
    CalendarHeading,
    CalendarNext,
    CalendarPrev,
    CalendarRoot,
} from 'reka-ui';
import { computed, ref } from 'vue';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

/** A date as `YYYY-MM-DD`, or empty for no date. */
const model = defineModel<string>({ default: '' });

defineProps<{ id?: string; placeholder?: string }>();

const open = ref(false);

const value = computed({
    get: () => (model.value ? parseDate(model.value) : undefined),
    set: (date: DateValue | undefined) => {
        model.value = date?.toString() ?? '';
        open.value = false;
    },
});

const shown = computed(() => model.value.split('-').reverse().join('-'));
</script>

<template>
    <div class="relative">
        <Popover v-model:open="open">
            <PopoverTrigger as-child>
                <button
                    :id="id"
                    type="button"
                    class="flex h-9 w-full min-w-0 items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1 text-left text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30"
                >
                    <CalendarDays class="size-4 text-muted-foreground" />
                    <span v-if="model">{{ shown }}</span>
                    <span v-else class="text-muted-foreground">{{
                        placeholder ?? 'Kies een datum'
                    }}</span>
                </button>
            </PopoverTrigger>
            <PopoverContent class="w-auto p-3" align="start">
                <CalendarRoot
                    v-slot="{ weekDays, grid }"
                    v-model="value"
                    locale="nl-NL"
                    :week-starts-on="1"
                    fixed-weeks
                    initial-focus
                >
                    <CalendarHeader
                        class="flex items-center justify-between pb-2"
                    >
                        <CalendarPrev
                            class="inline-flex size-7 items-center justify-center rounded-md border hover:bg-muted"
                            aria-label="Vorige maand"
                        >
                            <ChevronLeft class="size-4" />
                        </CalendarPrev>
                        <CalendarHeading
                            class="text-sm font-semibold capitalize"
                        />
                        <CalendarNext
                            class="inline-flex size-7 items-center justify-center rounded-md border hover:bg-muted"
                            aria-label="Volgende maand"
                        >
                            <ChevronRight class="size-4" />
                        </CalendarNext>
                    </CalendarHeader>
                    <CalendarGrid
                        v-for="month in grid"
                        :key="month.value.toString()"
                        class="border-collapse"
                    >
                        <CalendarGridHead>
                            <CalendarGridRow class="flex">
                                <CalendarHeadCell
                                    v-for="day in weekDays"
                                    :key="day"
                                    class="w-8 text-[11px] font-semibold text-muted-foreground"
                                >
                                    {{ day }}
                                </CalendarHeadCell>
                            </CalendarGridRow>
                        </CalendarGridHead>
                        <CalendarGridBody>
                            <CalendarGridRow
                                v-for="(week, index) in month.rows"
                                :key="index"
                                class="mt-1 flex"
                            >
                                <CalendarCell
                                    v-for="day in week"
                                    :key="day.toString()"
                                    :date="day"
                                    class="p-0"
                                >
                                    <CalendarCellTrigger
                                        :day="day"
                                        :month="month.value"
                                        class="inline-flex size-8 items-center justify-center rounded-md text-sm hover:bg-muted data-[outside-view]:text-muted-foreground/50 data-[selected]:bg-primary data-[selected]:font-bold data-[selected]:text-primary-foreground data-[today]:not-data-[selected]:font-bold data-[today]:not-data-[selected]:text-primary"
                                    />
                                </CalendarCell>
                            </CalendarGridRow>
                        </CalendarGridBody>
                    </CalendarGrid>
                </CalendarRoot>
            </PopoverContent>
        </Popover>
        <button
            v-if="model"
            type="button"
            class="absolute top-1/2 right-2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground disabled:hidden"
            aria-label="Datum wissen"
            @click="model = ''"
        >
            <X class="size-3.5" />
        </button>
    </div>
</template>
