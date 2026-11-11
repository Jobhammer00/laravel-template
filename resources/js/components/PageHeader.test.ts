// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import PageHeader from '@/components/PageHeader.vue';

describe('PageHeader', () => {
    it('shows the title, and the actions only when given', () => {
        const bare = mount(PageHeader, { props: { title: 'Producten' } });
        const withActions = mount(PageHeader, {
            props: { title: 'Producten' },
            slots: { default: '<button>Nieuw product</button>' },
        });

        expect(bare.find('h1').text()).toBe('Producten');
        expect(bare.findAll('div')).toHaveLength(1);
        expect(withActions.find('button').text()).toBe('Nieuw product');
    });
});
