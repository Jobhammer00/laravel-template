// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import PageInfo from '@/components/PageInfo.vue';

afterEach(() => {
    document.body.innerHTML = '';
});

describe('PageInfo', () => {
    it('shows the explanation after clicking the labelled info button', async () => {
        const wrapper = mount(PageInfo, {
            props: { label: 'Uitleg over acties' },
            slots: { default: '<p>Een actie geeft korting.</p>' },
            attachTo: document.body,
        });
        const button = wrapper.find('button');

        expect(button.attributes('aria-label')).toBe('Uitleg over acties');
        expect(document.body.textContent).not.toContain('korting');

        await button.trigger('click');
        await flushPromises();

        expect(document.body.textContent).toContain('Een actie geeft korting.');
        wrapper.unmount();
    });
});
