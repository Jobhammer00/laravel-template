<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/vue-3';
import { onBeforeUnmount, watch } from 'vue';

const props = defineProps<{ id?: string; label: string }>();

/** HTML; the server keeps only what the toolbar makes. */
const model = defineModel<string | null>({ required: true });

const editor = useEditor({
    content: model.value ?? '',
    extensions: [
        StarterKit.configure({
            heading: { levels: [3] },
            blockquote: false,
            code: false,
            codeBlock: false,
            horizontalRule: false,
            link: false,
            strike: false,
            underline: false,
        }),
    ],
    editorProps: {
        attributes: {
            ...(props.id ? { id: props.id } : {}),
            'aria-label': props.label,
            class: 'min-h-[120px] px-3 py-2.5 text-[13.5px] outline-none [&_h3]:mt-2 [&_h3]:mb-1 [&_h3]:text-[15px] [&_h3]:font-bold [&_li]:my-0.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5',
        },
    },
    onUpdate: () => (model.value = html()),
});

/** Null for an empty editor, like a question without text, so clearing it is no change. */
function html(): string | null {
    return !editor.value || editor.value.isEmpty
        ? null
        : editor.value.getHTML();
}

// A new value from outside, such as opening another question, replaces the text.
watch(model, (value) => {
    if (editor.value && value !== html()) {
        editor.value.commands.setContent(value ?? '', { emitUpdate: false });
    }
});

onBeforeUnmount(() => editor.value?.destroy());

const tools = [
    {
        label: 'Vet',
        text: 'B',
        style: 'font-extrabold',
        name: 'bold',
        run: () => editor.value?.chain().focus().toggleBold().run(),
    },
    {
        label: 'Cursief',
        text: 'I',
        style: 'italic',
        name: 'italic',
        run: () => editor.value?.chain().focus().toggleItalic().run(),
    },
    {
        label: 'Kop',
        text: 'Kop',
        style: '',
        name: 'heading',
        run: () =>
            editor.value?.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
        label: 'Lijst',
        text: '• Lijst',
        style: '',
        name: 'bulletList',
        run: () => editor.value?.chain().focus().toggleBulletList().run(),
    },
    {
        label: 'Genummerde lijst',
        text: '1. Lijst',
        style: '',
        name: 'orderedList',
        run: () => editor.value?.chain().focus().toggleOrderedList().run(),
    },
];
</script>

<template>
    <div
        class="overflow-hidden rounded-lg border bg-card focus-within:ring-[3px] focus-within:ring-ring/50"
    >
        <div
            class="flex gap-0.5 border-b bg-muted/30 p-1.5"
            role="toolbar"
            :aria-label="`Opmaak van ${label}`"
        >
            <button
                v-for="tool in tools"
                :key="tool.name"
                type="button"
                class="h-7 rounded-md border border-transparent px-2 text-[13px] font-bold text-muted-foreground hover:bg-muted hover:text-foreground aria-pressed:bg-primary-muted aria-pressed:text-primary"
                :aria-label="tool.label"
                :title="tool.label"
                :aria-pressed="editor?.isActive(tool.name) ?? false"
                @mousedown.prevent
                @click="tool.run"
            >
                <span :class="tool.style">{{ tool.text }}</span>
            </button>
        </div>
        <EditorContent :editor="editor" />
    </div>
</template>
