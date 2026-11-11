// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import PasskeyItem from '@/components/PasskeyItem.vue';
import type { Passkey } from '@/types';

afterEach(() => {
    document.body.innerHTML = '';
});

const passkey = (data: Partial<Passkey> = {}): Passkey => ({
    id: 7,
    name: 'MacBook',
    authenticator: 'iCloud Keychain',
    created_at_diff: '2 days ago',
    last_used_at_diff: '1 hour ago',
    ...data,
});

const removeButton = (): HTMLButtonElement =>
    [...document.querySelectorAll('button')].find(
        (button) => button.textContent?.trim() === 'Remove passkey',
    )!;

describe('PasskeyItem', () => {
    it('shows the name, authenticator and when it was added and last used', () => {
        const wrapper = mount(PasskeyItem, { props: { passkey: passkey() } });

        expect(wrapper.text()).toContain('MacBook');
        expect(wrapper.text()).toContain('iCloud Keychain');
        expect(wrapper.text()).toContain('Added 2 days ago');
        expect(wrapper.text()).toContain('Last used 1 hour ago');
    });

    it('leaves out an unknown authenticator and a passkey never used', () => {
        const wrapper = mount(PasskeyItem, {
            props: {
                passkey: passkey({
                    authenticator: null,
                    last_used_at_diff: null,
                }),
            },
        });

        expect(wrapper.find('.uppercase').exists()).toBe(false);
        expect(wrapper.text()).not.toContain('Last used');
    });

    it('asks before removing and can try again after a failure', async () => {
        const wrapper = mount(PasskeyItem, {
            props: { passkey: passkey() },
            attachTo: document.body,
        });

        await wrapper.find('button').trigger('click');
        await flushPromises();
        expect(document.body.textContent).toContain(
            'Are you sure you want to remove the "MacBook" passkey?',
        );

        removeButton().click();
        await flushPromises();

        const [[id, onError]] = wrapper.emitted('remove') as [
            [number, () => void],
        ];
        expect(id).toBe(7);
        const busy = [...document.querySelectorAll('button')].find(
            (button) => button.textContent?.trim() === 'Removing...',
        )!;
        expect(busy.disabled).toBe(true);

        onError();
        await flushPromises();

        expect(removeButton().disabled).toBe(false);
        wrapper.unmount();
    });
});
