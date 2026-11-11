// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Pagination from '@/components/Pagination.vue';
import type { Paginated } from '@/types';

const paginator = (data: Partial<Paginated<unknown>>): Paginated<unknown> => ({
    data: [],
    current_page: 2,
    last_page: 3,
    from: 1001,
    to: 2000,
    total: 2500,
    prev_page_url: '/users?page=1',
    next_page_url: '/users?page=3',
    ...data,
});

describe('Pagination', () => {
    it('shows the range in Dutch notation and links to both neighbours', () => {
        const wrapper = mount(Pagination, {
            props: { paginator: paginator({}) },
        });

        expect(wrapper.text()).toContain('1.001–2.000 van 2.500');
        expect(wrapper.text()).toContain('Pagina 2 / 3');
        expect(
            wrapper.findAll('a').map((link) => link.attributes('href')),
        ).toEqual(['/users?page=1', '/users?page=3']);
    });

    it('disables the buttons where there is no other page', () => {
        const wrapper = mount(Pagination, {
            props: {
                paginator: paginator({
                    current_page: 1,
                    last_page: 1,
                    from: null,
                    to: null,
                    total: 3,
                    prev_page_url: null,
                    next_page_url: null,
                }),
            },
        });

        expect(wrapper.findAll('a')).toHaveLength(0);
        expect(
            wrapper
                .findAll('button')
                .map((button) => button.attributes('disabled')),
        ).toEqual(['', '']);
        expect(wrapper.text()).toContain('0–0 van 3');
    });

    it('hides itself when there is nothing to page through', () => {
        const wrapper = mount(Pagination, {
            props: { paginator: paginator({ total: 0 }) },
        });

        expect(wrapper.find('nav').exists()).toBe(false);
    });
});
