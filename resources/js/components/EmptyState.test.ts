// @vitest-environment happy-dom
import { Package } from '@lucide/vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import EmptyState from '@/components/EmptyState.vue';

describe('EmptyState', () => {
    it('shows the icon, the text and the actions', () => {
        const wrapper = mount(EmptyState, {
            props: { icon: Package },
            slots: {
                default: 'Nog niets toegevoegd.',
                actions: '<button>Nieuw</button>',
            },
        });

        expect(wrapper.find('svg').exists()).toBe(true);
        expect(wrapper.text()).toContain('Nog niets toegevoegd.');
        expect(wrapper.find('button').text()).toBe('Nieuw');
    });
});
