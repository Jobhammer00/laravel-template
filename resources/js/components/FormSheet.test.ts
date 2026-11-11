// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import FormSheet from '@/components/FormSheet.vue';

afterEach(() => {
    document.body.innerHTML = '';
});

const sheet = (dirty: boolean) => {
    const wrapper = mount(FormSheet, {
        props: {
            title: 'Variabele bewerken',
            description: 'Pas de variabele aan',
            dirty,
            processing: false,
            open: true,
            'onUpdate:open': (open: boolean) => wrapper.setProps({ open }),
        },
        slots: { default: '<input name="name" />' },
        attachTo: document.body,
    });

    return wrapper;
};

const button = (text: string): HTMLButtonElement =>
    [...document.querySelectorAll('button')].find(
        (element) => element.textContent?.trim() === text,
    )!;

describe('FormSheet', () => {
    it('submits the form with the save button', async () => {
        const wrapper = sheet(false);
        await flushPromises();

        button('Opslaan').click();

        expect(wrapper.emitted('submit')).toHaveLength(1);
        expect(document.body.textContent).toContain('Variabele bewerken');
        wrapper.unmount();
    });

    it('closes right away on cancel without changes', async () => {
        const wrapper = sheet(false);
        await flushPromises();

        button('Annuleren').click();
        await flushPromises();

        expect(wrapper.props('open')).toBe(false);
        wrapper.unmount();
    });

    it('asks before throwing away unsaved changes', async () => {
        const wrapper = sheet(true);
        await flushPromises();

        button('Annuleren').click();
        await flushPromises();

        expect(wrapper.props('open')).toBe(true);
        expect(document.body.textContent).toContain('Wijzigingen weggooien?');

        button('Weggooien').click();
        await flushPromises();

        expect(wrapper.props('open')).toBe(false);
        wrapper.unmount();
    });
});
