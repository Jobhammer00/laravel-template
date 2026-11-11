<script setup lang="ts">
import { ChevronsUpDown, Pipette } from '@lucide/vue';
import type { Color } from 'reka-ui';
import {
    ColorAreaArea,
    ColorAreaRoot,
    ColorAreaThumb,
    ColorFieldInput,
    ColorFieldRoot,
    ColorSliderRoot,
    ColorSliderThumb,
    ColorSliderTrack,
    ColorSwatch,
    colorToHex,
    convertToHsb,
    convertToRgb,
    parseColor,
} from 'reka-ui';
import { computed, ref, watch } from 'vue';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

const props = defineProps<{ label: string }>();
const model = defineModel<string>({ required: true });

const toHsb = (value: string): Color | null => {
    try {
        return convertToHsb(parseColor(value));
    } catch {
        return null;
    }
};

// The area and hue slider share one HSB colour, so the hue stays put when
// you drag to grey or black instead of jumping back to red.
const color = ref<Color>(toHsb(model.value) ?? toHsb('#000000')!);

watch(model, (value) => {
    const parsed = toHsb(value);

    if (parsed && colorToHex(parsed) !== colorToHex(color.value)) {
        color.value = parsed;
    }
});

const pick = (value: Color) => {
    color.value = convertToHsb(value);
    model.value = colorToHex(value).toUpperCase();
};

// As Chrome's own picker, but on HEX first (DP1-14); the arrows switch to RGB.
const mode = ref<'hex' | 'rgb'>('hex');
const channels = ['r', 'g', 'b'] as const;
const rgb = computed(() => {
    const value = convertToRgb(color.value);

    return value.space === 'rgb' ? value : { r: 0, g: 0, b: 0 };
});

const setChannel = (channel: (typeof channels)[number], input: string) => {
    const value = Number(input);

    if (input === '' || !Number.isInteger(value) || value < 0 || value > 255) {
        return;
    }

    const next = { ...rgb.value, [channel]: value };
    pick(parseColor(`rgb(${next.r}, ${next.g}, ${next.b})`));
};

// Chromium only; elsewhere the button is left out.
type EyeDropperApi = { open: () => Promise<{ sRGBHex: string }> };
const EyeDropper = (
    window as unknown as { EyeDropper?: new () => EyeDropperApi }
).EyeDropper;

const sample = async () => {
    try {
        pick(parseColor((await new EyeDropper!().open()).sRGBHex));
    } catch {
        // Cancelled with Escape: keep the colour as it was.
    }
};
</script>

<template>
    <Popover>
        <PopoverTrigger
            class="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border bg-card"
            :aria-label="`${props.label}: ${model}`"
            :title="model"
        >
            <ColorSwatch
                :color="model"
                class="size-6 rounded-sm border bg-(--reka-color-swatch-color)"
            />
        </PopoverTrigger>
        <PopoverContent class="flex w-64 flex-col gap-3 p-0" align="end">
            <ColorAreaRoot
                v-slot="{ style }"
                :model-value="color"
                color-space="hsb"
                x-channel="saturation"
                y-channel="brightness"
                class="relative h-36 w-full overflow-hidden rounded-t-md"
                @update:color="pick"
            >
                <ColorAreaArea class="size-full" :style="style">
                    <ColorAreaThumb
                        class="size-3.5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.6)]"
                    />
                </ColorAreaArea>
            </ColorAreaRoot>

            <div class="flex items-center gap-3 px-3">
                <button
                    v-if="EyeDropper"
                    type="button"
                    class="shrink-0 cursor-pointer text-foreground hover:text-primary"
                    aria-label="Kleur van het scherm oppikken"
                    @click="sample"
                >
                    <Pipette class="size-4" />
                </button>
                <ColorSwatch
                    :color="model"
                    class="size-7 shrink-0 rounded-full border bg-(--reka-color-swatch-color)"
                />
                <ColorSliderRoot
                    :model-value="color"
                    color-space="hsb"
                    channel="hue"
                    class="relative flex h-4 w-full items-center"
                    @update:color="pick"
                >
                    <ColorSliderTrack class="h-3 w-full rounded-full">
                        <ColorSliderThumb
                            class="block size-3.5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.6)]"
                        />
                    </ColorSliderTrack>
                </ColorSliderRoot>
            </div>

            <div class="flex items-start gap-1.5 px-3 pb-3">
                <div v-if="mode === 'hex'" class="flex-1 text-center">
                    <ColorFieldRoot
                        :model-value="model"
                        @update:color="pick"
                    >
                        <ColorFieldInput
                            class="h-8 w-full rounded-md border bg-transparent px-2 text-center font-mono text-sm uppercase"
                            :aria-label="`HEX-code van ${props.label}`"
                        />
                    </ColorFieldRoot>
                    <span class="mt-1 block text-xs text-muted-foreground"
                        >HEX</span
                    >
                </div>
                <template v-else>
                    <label
                        v-for="channel in channels"
                        :key="channel"
                        class="flex-1 text-center"
                    >
                        <input
                            type="number"
                            min="0"
                            max="255"
                            class="h-8 w-full rounded-md border bg-transparent px-1 text-center text-sm [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                            :value="Math.round(rgb[channel])"
                            :aria-label="`${channel.toUpperCase()} van ${props.label}`"
                            @change="
                                setChannel(
                                    channel,
                                    ($event.target as HTMLInputElement).value,
                                )
                            "
                        />
                        <span class="mt-1 block text-xs text-muted-foreground">{{
                            channel.toUpperCase()
                        }}</span>
                    </label>
                </template>
                <button
                    type="button"
                    class="flex h-8 w-5 shrink-0 cursor-pointer items-center justify-center text-muted-foreground hover:text-foreground"
                    :aria-label="
                        mode === 'hex' ? 'Toon als RGB' : 'Toon als HEX'
                    "
                    @click="mode = mode === 'hex' ? 'rgb' : 'hex'"
                >
                    <ChevronsUpDown class="size-3.5" />
                </button>
            </div>
        </PopoverContent>
    </Popover>
</template>
