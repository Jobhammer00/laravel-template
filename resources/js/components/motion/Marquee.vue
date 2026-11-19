<script setup lang="ts">
// A band that runs across the screen without end: logos, services, a slogan. The content goes in twice.
withDefaults(
    defineProps<{
        /** Seconds for one round. */
        duration?: number;
        reverse?: boolean;
        pauseOnHover?: boolean;
        /** The space between the items, such as 3rem. */
        gap?: string;
    }>(),
    { duration: 30, reverse: false, pauseOnHover: true, gap: '3rem' },
);
</script>

<template>
    <div
        class="r14-marquee"
        :data-reverse="reverse || undefined"
        :data-pause="pauseOnHover || undefined"
        :style="{ '--marquee-duration': `${duration}s`, '--marquee-gap': gap }"
    >
        <div class="r14-marquee-track">
            <div class="r14-marquee-group"><slot /></div>
            <div class="r14-marquee-group" aria-hidden="true"><slot /></div>
        </div>
    </div>
</template>
