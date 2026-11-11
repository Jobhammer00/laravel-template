// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import DatePicker from '@/components/DatePicker.vue';

afterEach(() => {
    document.body.innerHTML = '';
});

const picker = (modelValue: string) => {
    const wrapper = mount(DatePicker, {
        props: {
            id: 'starts_at',
            modelValue,
            'onUpdate:modelValue': (value: string) =>
                wrapper.setProps({ modelValue: value }),
        },
        attachTo: document.body,
    });

    return wrapper;
};

describe('DatePicker', () => {
    it('shows the date the Dutch way round', () => {
        const wrapper = picker('2026-11-06');

        expect(wrapper.find('#starts_at').text()).toBe('06-11-2026');
        wrapper.unmount();
    });

    it('shows the placeholder without a date', () => {
        const wrapper = picker('');

        expect(wrapper.find('#starts_at').text()).toBe('Kies een datum');
        expect(wrapper.find('[aria-label="Datum wissen"]').exists()).toBe(
            false,
        );
        wrapper.unmount();
    });

    it('picks a day from the calendar and closes it', async () => {
        const wrapper = picker('2026-11-06');

        await wrapper.find('#starts_at').trigger('click');
        await flushPromises();
        const day = [
            ...document.querySelectorAll<HTMLElement>(
                '[data-reka-calendar-cell-trigger]',
            ),
        ].find(
            (cell) =>
                cell.textContent?.trim() === '20' &&
                !cell.hasAttribute('data-outside-view'),
        )!;
        day.click();
        await flushPromises();

        expect(wrapper.props('modelValue')).toBe('2026-11-20');
        expect(document.querySelector('[role=grid]')).toBeNull();
        wrapper.unmount();
    });

    it('clears the date', async () => {
        const wrapper = picker('2026-11-06');

        await wrapper.find('[aria-label="Datum wissen"]').trigger('click');

        expect(wrapper.props('modelValue')).toBe('');
        wrapper.unmount();
    });
});
