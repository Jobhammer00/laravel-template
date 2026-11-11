<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { logout } from '@/routes';
import { send } from '@/routes/verification';

defineOptions({
    layout: {
        title: 'E-mailadres bevestigen',
        description:
            'Bevestig je e-mailadres via de link die we je net hebben gemaild.',
    },
});

defineProps<{
    status?: string;
}>();
</script>

<template>
    <div class="flex flex-col gap-8">
        <Head title="E-mailadres bevestigen" />

        <div
            v-if="status === 'verification-link-sent'"
            class="mb-4 text-center text-sm font-medium text-success"
        >
            Er is een nieuwe bevestigingslink naar je e-mailadres gestuurd.
        </div>

        <Form
            v-bind="send.form()"
            class="space-y-6 text-center"
            v-slot="{ processing }"
        >
            <Button :disabled="processing" variant="secondary">
                <Spinner v-if="processing" />
                Bevestigingsmail opnieuw versturen
            </Button>

            <TextLink
                :href="logout()"
                as="button"
                class="mx-auto block text-sm"
            >
                Uitloggen
            </TextLink>
        </Form>
    </div>
</template>
