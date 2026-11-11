// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, expect, it } from 'vitest';
import { ColorPicker } from '@/components/ui/color-picker';

afterEach(() => {
    document.body.innerHTML = '';
});

it('opens on a HEX field and gives the picked colour back as HEX', async () => {
    const wrapper = mount(ColorPicker, {
        props: {
            label: 'Kleur van Antraciet',
            modelValue: '#383E42',
            'onUpdate:modelValue': (value: string) =>
                wrapper.setProps({ modelValue: value }),
        },
        attachTo: document.body,
    });

    await wrapper.get('button').trigger('click');
    await flushPromises();

    const hex = document.querySelector<HTMLInputElement>(
        'input[aria-label="HEX-code van Kleur van Antraciet"]',
    )!;
    expect(hex.value.toUpperCase()).toBe('#383E42');

    hex.value = '#ff0000';
    hex.dispatchEvent(new Event('input'));
    hex.dispatchEvent(new Event('blur'));
    await flushPromises();

    expect(wrapper.props('modelValue')).toBe('#FF0000');
    expect(wrapper.get('button').attributes('aria-label')).toBe(
        'Kleur van Antraciet: #FF0000',
    );
});

it('switches to RGB fields and takes a channel from there', async () => {
    const wrapper = mount(ColorPicker, {
        props: {
            label: 'Kleur van Wit',
            modelValue: '#F1F0EA',
            'onUpdate:modelValue': (value: string) =>
                wrapper.setProps({ modelValue: value }),
        },
        attachTo: document.body,
    });

    await wrapper.get('button').trigger('click');
    await flushPromises();
    document
        .querySelector<HTMLButtonElement>('button[aria-label="Toon als RGB"]')!
        .click();
    await flushPromises();

    const red = document.querySelector<HTMLInputElement>(
        'input[aria-label="R van Kleur van Wit"]',
    )!;
    expect(red.value).toBe('241');

    red.value = '0';
    red.dispatchEvent(new Event('change'));
    await flushPromises();

    expect(wrapper.props('modelValue')).toBe('#00F0EA');
});

it('follows a colour set from outside and ignores an invalid channel', async () => {
    const wrapper = mount(ColorPicker, {
        props: {
            label: 'Kleur',
            modelValue: '#000000',
            'onUpdate:modelValue': (value: string) =>
                wrapper.setProps({ modelValue: value }),
        },
        attachTo: document.body,
    });

    await wrapper.setProps({ modelValue: 'geen kleur' });
    await wrapper.setProps({ modelValue: '#FF0000' });
    await wrapper.get('button').trigger('click');
    await flushPromises();
    document
        .querySelector<HTMLButtonElement>('button[aria-label="Toon als RGB"]')!
        .click();
    await flushPromises();

    const green = document.querySelector<HTMLInputElement>(
        'input[aria-label="G van Kleur"]',
    )!;
    expect(
        document.querySelector<HTMLInputElement>(
            'input[aria-label="R van Kleur"]',
        )!.value,
    ).toBe('255');

    green.value = '300';
    green.dispatchEvent(new Event('change'));
    await flushPromises();

    expect(wrapper.props('modelValue')).toBe('#FF0000');
});
