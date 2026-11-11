import { describe, expect, it } from 'vitest';
import { getInitials, useInitials } from '@/composables/useInitials';

describe('getInitials', () => {
    it('takes the first letters of the first and last name', () => {
        expect(getInitials('piet van der berg')).toBe('PB');
    });

    it('takes one letter for a single name', () => {
        expect(getInitials('  piet ')).toBe('P');
    });

    it('returns nothing for a missing or blank name', () => {
        expect(getInitials()).toBe('');
        expect(getInitials('   ')).toBe('');
    });

    it('is also offered through the composable', () => {
        expect(useInitials().getInitials('Anna Jansen')).toBe('AJ');
    });
});
