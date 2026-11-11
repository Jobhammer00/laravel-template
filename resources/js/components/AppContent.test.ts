// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import AppContent from '@/components/AppContent.vue';

describe('AppContent', () => {
    it('renders the content as the sidebar inset by default', () => {
        const wrapper = mount(AppContent, {
            props: { class: 'min-w-0' },
            slots: { default: 'Inhoud' },
        });

        expect(wrapper.find('[data-slot=sidebar-inset]').exists()).toBe(true);
        expect(wrapper.classes()).toContain('min-w-0');
        expect(wrapper.text()).toBe('Inhoud');
    });

    it('renders the content in a centered main for the header variant', () => {
        const wrapper = mount(AppContent, {
            props: { variant: 'header', class: 'pt-4' },
            slots: { default: 'Inhoud' },
        });

        expect(wrapper.element.tagName).toBe('MAIN');
        expect(wrapper.classes()).toContain('max-w-7xl');
        expect(wrapper.classes()).toContain('pt-4');
    });
});
