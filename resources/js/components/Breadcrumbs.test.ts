// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Breadcrumbs from '@/components/Breadcrumbs.vue';

describe('Breadcrumbs', () => {
    it('links every crumb but the last, which is the current page', () => {
        const wrapper = mount(Breadcrumbs, {
            props: {
                breadcrumbs: [
                    { title: 'Producten', href: '/products' },
                    { title: 'Rolluik', href: '/products/1' },
                    { title: 'Bewerken', href: '/products/1/edit' },
                ],
            },
        });

        expect(
            wrapper
                .findAll('a')
                .map((link) => [link.text(), link.attributes('href')]),
        ).toEqual([
            ['Producten', '/products'],
            ['Rolluik', '/products/1'],
        ]);
        expect(wrapper.find('[aria-current=page]').text()).toBe('Bewerken');
        expect(wrapper.findAll('[role=presentation]')).toHaveLength(2);
    });
});
