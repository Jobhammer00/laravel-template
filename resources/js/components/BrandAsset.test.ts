// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import BrandAsset from '@/components/BrandAsset.vue';

describe('BrandAsset', () => {
    it('shows the design system asset by its name', () => {
        const img = mount(BrandAsset, {
            props: { name: 'logo.svg', alt: 'Logo' },
        }).find('img');

        expect(img.attributes('src')).toBe('/images/design/logo.svg');
        expect(img.attributes('alt')).toBe('Logo');
    });
});
