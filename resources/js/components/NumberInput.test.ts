// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import NumberInput from '@/components/NumberInput.vue';

function field(decimals: number) {
    return mount(NumberInput, {
        attachTo: document.body,
        props: { decimals, modelValue: null },
    });
}

function type(
    input: HTMLInputElement,
    data: string,
    inputType = 'insertText',
): InputEvent {
    const event = new InputEvent('beforeinput', {
        data,
        inputType,
        bubbles: true,
        cancelable: true,
    });
    input.dispatchEvent(event);

    return event;
}

describe('NumberInput', () => {
    it('types a dot as the decimal comma, so 2.5 does not become 25', async () => {
        const wrapper = field(4);
        const input = wrapper.find('input').element;
        await wrapper.find('input').setValue('2');
        input.setSelectionRange(1, 1);

        type(input, '.');

        expect(input.value).toBe('2,');
    });

    it('pastes 2.5 as 2,5', () => {
        const input = field(4).find('input').element;

        type(input, '2.5', 'insertFromPaste');

        expect(input.value).toBe('2,5');
    });

    it('refuses decimals in a whole number with a message, instead of dropping the comma', async () => {
        const wrapper = field(0);
        const input = wrapper.find('input').element;
        await wrapper.find('input').setValue('12');

        const event = type(input, ',');
        type(input, '5');
        await wrapper.vm.$nextTick();

        expect(event.defaultPrevented).toBe(true);
        expect(input.value).toBe('12');
        // Still shown after the next digit, so 125 does not go unnoticed.
        expect(wrapper.text()).toContain(
            'Een geheel getal heeft geen decimalen.',
        );

        type(input, '', 'deleteContentBackward');
        await wrapper.vm.$nextTick();

        expect(wrapper.text()).not.toContain('Een geheel getal');
    });

    it('drops the message when the field becomes a decimal', async () => {
        const wrapper = field(0);
        type(wrapper.find('input').element, ',');
        await wrapper.vm.$nextTick();

        await wrapper.setProps({ decimals: 4 });

        expect(wrapper.text()).not.toContain('Een geheel getal');
    });
});
