import { describe, expect, it } from 'vitest';
import { asset } from '@/lib/assets';

describe('asset', () => {
    it('points to the file the design-system export writes', () => {
        expect(asset('logo.svg')).toBe('/images/design/logo.svg');
        expect(asset('hero foto.jpg')).toBe('/images/design/hero%20foto.jpg');
    });
});
