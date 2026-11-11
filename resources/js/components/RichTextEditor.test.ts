// @vitest-environment happy-dom
import type { Editor } from '@tiptap/vue-3';
import { EditorContent } from '@tiptap/vue-3';
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import RichTextEditor from '@/components/RichTextEditor.vue';

afterEach(() => {
    document.body.innerHTML = '';
});

const editor = (modelValue: string | null) => {
    const wrapper = mount(RichTextEditor, {
        props: {
            id: 'intro',
            label: 'Introductie',
            modelValue,
            'onUpdate:modelValue': (value: string | null) =>
                wrapper.setProps({ modelValue: value }),
        },
        attachTo: document.body,
    });

    return wrapper;
};

describe('RichTextEditor', () => {
    it('shows the given text in a labelled editor', async () => {
        const wrapper = editor('<p>Hallo</p>');
        await flushPromises();

        const content = wrapper.find('#intro');
        expect(content.attributes('aria-label')).toBe('Introductie');
        expect(content.html()).toContain('<p>Hallo</p>');
        expect(wrapper.find('[role=toolbar]').attributes('aria-label')).toBe(
            'Opmaak van Introductie',
        );
        wrapper.unmount();
    });

    it('turns the text into a list or heading with the toolbar and passes the html on', async () => {
        const wrapper = editor('<p>Hallo</p>');
        await flushPromises();
        const tool = (label: string) => wrapper.find(`[aria-label="${label}"]`);

        await tool('Lijst').trigger('click');

        expect(wrapper.props('modelValue')).toContain(
            '<ul><li><p>Hallo</p></li></ul>',
        );
        expect(tool('Lijst').attributes('aria-pressed')).toBe('true');

        await tool('Genummerde lijst').trigger('click');

        expect(wrapper.props('modelValue')).toContain(
            '<ol><li><p>Hallo</p></li></ol>',
        );

        await tool('Genummerde lijst').trigger('click');
        await tool('Kop').trigger('click');

        expect(wrapper.props('modelValue')).toContain('<h3>Hallo</h3>');
        wrapper.unmount();
    });

    it('makes the selected text bold and italic', async () => {
        const wrapper = editor('<p>Hallo</p>');
        await flushPromises();
        (
            wrapper.findComponent(EditorContent).props('editor') as Editor
        ).commands.selectAll();

        await wrapper.find('[aria-label=Vet]').trigger('click');
        await wrapper.find('[aria-label=Cursief]').trigger('click');

        expect(wrapper.props('modelValue')).toBe(
            '<p><strong><em>Hallo</em></strong></p>',
        );
        expect(
            wrapper.find('[aria-label=Vet]').attributes('aria-pressed'),
        ).toBe('true');
        wrapper.unmount();
    });

    it('passes null on when all text is removed, so clearing is no change', async () => {
        const wrapper = editor('<p>Hallo</p>');
        await flushPromises();

        (wrapper.findComponent(EditorContent).props('editor') as Editor)
            .chain()
            .selectAll()
            .deleteSelection()
            .run();
        await flushPromises();

        expect(wrapper.props('modelValue')).toBeNull();
        wrapper.unmount();
    });

    it('replaces the text when a new value comes from outside', async () => {
        const wrapper = editor('<p>Eerste</p>');
        await flushPromises();

        await wrapper.setProps({ modelValue: '<p>Tweede</p>' });
        await flushPromises();

        expect(wrapper.find('#intro').html()).toContain('Tweede');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();

        await wrapper.setProps({ modelValue: null });
        await flushPromises();

        expect(wrapper.find('#intro').text()).toBe('');
        wrapper.unmount();
    });
});
