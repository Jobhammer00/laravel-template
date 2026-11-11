// @vitest-environment happy-dom
import { router } from '@inertiajs/vue3';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import VerifyEmail from '@/pages/auth/VerifyEmail.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
}));

afterEach(() => {
    vi.restoreAllMocks();
});

describe('VerifyEmail', () => {
    it('sends the verification mail again', async () => {
        const visit = vi.spyOn(router, 'visit').mockImplementation(() => {});
        const wrapper = mount(VerifyEmail);

        await wrapper.find('form').trigger('submit');

        expect(visit).toHaveBeenCalledWith(
            '/email/verification-notification',
            expect.objectContaining({ method: 'post' }),
        );
        expect(wrapper.text()).not.toContain('nieuwe bevestigingslink');
    });

    it('confirms a new link was sent and offers logging out', () => {
        const wrapper = mount(VerifyEmail, {
            props: { status: 'verification-link-sent' },
        });

        expect(wrapper.text()).toContain(
            'Er is een nieuwe bevestigingslink naar je e-mailadres gestuurd.',
        );
        expect(
            wrapper
                .findAll('button')
                .find((button) => button.text() === 'Uitloggen'),
        ).toBeDefined();
    });
});
