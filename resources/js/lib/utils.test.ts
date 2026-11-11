import { describe, expect, it } from 'vitest';
import { cn, toUrl } from '@/lib/utils';

describe('cn', () => {
    it('joins class names and drops falsy values', () => {
        expect(cn('px-2', false, undefined, 'py-1')).toBe('px-2 py-1');
    });

    it('lets the last conflicting Tailwind class win', () => {
        expect(cn('px-2', 'px-4')).toBe('px-4');
    });
});

describe('toUrl', () => {
    it('returns a string href unchanged', () => {
        expect(toUrl('/dashboard')).toBe('/dashboard');
    });

    it('returns the url of a route definition', () => {
        expect(toUrl({ url: '/dashboard', method: 'get' })).toBe('/dashboard');
    });
});
