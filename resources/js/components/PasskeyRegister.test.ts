// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Ref } from 'vue';
import PasskeyRegister from '@/components/PasskeyRegister.vue';

const passkey = vi.hoisted(() => ({
    onSuccess: null as (() => void) | null,
    register: vi.fn(),
    isLoading: null as never as Ref<boolean>,
    error: null as never as Ref<string | null>,
    isSupported: null as never as Ref<boolean>,
}));

vi.mock('@laravel/passkeys/vue', async () => {
    const { ref } = await import('vue');
    passkey.isLoading = ref(false);
    passkey.error = ref(null);
    passkey.isSupported = ref(true);

    return {
        usePasskeyRegister: (options: { onSuccess: () => void }) => {
            passkey.onSuccess = options.onSuccess;

            return passkey;
        },
    };
});

const MAC_CHROME =
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36';

afterEach(() => {
    vi.unstubAllGlobals();
    passkey.register.mockReset();
    passkey.isLoading.value = false;
    passkey.error.value = null;
    passkey.isSupported.value = true;
});

const openForm = async (userAgent = MAC_CHROME) => {
    vi.stubGlobal('navigator', { userAgent });
    const wrapper = mount(PasskeyRegister);
    await wrapper.find('button').trigger('click');

    return wrapper;
};

describe('PasskeyRegister', () => {
    it('suggests a name after the browser and device', async () => {
        expect(
            (await openForm()).find<HTMLInputElement>('#passkey-name').element
                .value,
        ).toBe('Chrome on Mac');
        expect(
            (
                await openForm(
                    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Version/17.0 Mobile Safari/604.1',
                )
            ).find<HTMLInputElement>('#passkey-name').element.value,
        ).toBe('Safari on iPhone');
        expect(
            (await openForm('curl/8.0')).find<HTMLInputElement>('#passkey-name')
                .element.value,
        ).toBe('');
    });

    it('registers the passkey under the chosen name', async () => {
        const wrapper = await openForm();
        await wrapper.find('#passkey-name').setValue('Werk-laptop');

        await wrapper.find('form').trigger('submit');

        expect(passkey.register).toHaveBeenCalledWith('Werk-laptop');
    });

    it('does not register without a name', async () => {
        const wrapper = await openForm();
        await wrapper.find('#passkey-name').setValue('   ');

        await wrapper.find('form').trigger('submit');

        expect(passkey.register).not.toHaveBeenCalled();
        expect(
            wrapper.find('button[type=submit]').attributes('disabled'),
        ).toBeDefined();
    });

    it('shows progress and errors while registering', async () => {
        const wrapper = await openForm();

        passkey.isLoading.value = true;
        passkey.error.value = 'Registreren afgebroken';
        await wrapper.vm.$nextTick();

        expect(wrapper.find('button[type=submit]').text()).toBe('Bezig…');
        expect(wrapper.text()).toContain('Registreren afgebroken');
    });

    it('closes the form and reports success after registering', async () => {
        const wrapper = await openForm();

        passkey.onSuccess!();
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted('success')).toHaveLength(1);
        expect(wrapper.find('form').exists()).toBe(false);
    });

    it('closes the form on cancel', async () => {
        const wrapper = await openForm();

        await wrapper.find('button[type=button]').trigger('click');

        expect(wrapper.find('form').exists()).toBe(false);
        expect(wrapper.text()).toContain('Passkey toevoegen');
    });

    it('offers no passkeys in a browser without support', () => {
        passkey.isSupported.value = false;
        vi.stubGlobal('navigator', { userAgent: MAC_CHROME });

        const button = mount(PasskeyRegister).find('button');

        expect(button.attributes('disabled')).toBeDefined();
        expect(button.attributes('title')).toContain(
            'ondersteunt geen passkeys',
        );
    });
});
