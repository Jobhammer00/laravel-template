// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SettingsRow from '@/components/settings/SettingsRow.vue';

describe('SettingsRow', () => {
    it('shows the title and description next to the setting', () => {
        const wrapper = mount(SettingsRow, {
            props: { title: 'Thema', description: 'Kies hoe het eruitziet.' },
            slots: { default: '<button>Licht</button>' },
        });

        expect(wrapper.text()).toContain('Thema');
        expect(wrapper.text()).toContain('Kies hoe het eruitziet.');
        expect(wrapper.find('.md\\:col-span-2 button').text()).toBe('Licht');
    });

    it('leaves out a missing description', () => {
        const wrapper = mount(SettingsRow, { props: { title: 'Thema' } });

        expect(wrapper.findAll('span')).toHaveLength(1);
    });
});
