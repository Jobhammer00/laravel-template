import { describe, expect, it } from 'vitest';
import { stock } from '@/lib/stock';

describe('stock', () => {
    it('serves every photo from public/images/stock, where the export puts the ones a screen uses', () => {
        const photos = Object.values(stock);

        expect(photos.length).toBeGreaterThan(0);

        for (const photo of photos) {
            expect(photo.src).toMatch(/^\/images\/stock\/\w+\.jpg$/);
            expect(photo.alt).not.toBe('');
        }
    });
});
