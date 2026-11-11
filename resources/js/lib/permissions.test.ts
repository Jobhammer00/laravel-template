import { describe, expect, it } from 'vitest';
import {
    inOrder,
    rightsForRole,
    sameRights,
    setRight,
    visibleNavGroups,
} from '@/lib/permissions';
import type { NavGroup } from '@/types';

describe('sameRights', () => {
    it('ignores the order', () => {
        expect(sameRights(['a', 'b'], ['b', 'a'])).toBe(true);
    });

    it('sees a missing or an extra right', () => {
        expect(sameRights(['a'], ['a', 'b'])).toBe(false);
        expect(sameRights(['a', 'b'], ['a'])).toBe(false);
        expect(sameRights(['a', 'c'], ['a', 'b'])).toBe(false);
    });
});

describe('rightsForRole', () => {
    it('overwrite makes the rights equal to the role', () => {
        expect(rightsForRole(['extra'], ['a', 'b'], 'overwrite')).toEqual([
            'a',
            'b',
        ]);
    });

    it('merge adds what is missing and keeps the deviations', () => {
        expect(rightsForRole(['extra', 'a'], ['a', 'b'], 'merge')).toEqual([
            'extra',
            'a',
            'b',
        ]);
    });

    it('does not hand back the role array itself', () => {
        const role = ['a'];

        expect(rightsForRole([], role, 'overwrite')).not.toBe(role);
    });
});

describe('setRight', () => {
    it('grants a right once', () => {
        expect(setRight(['a'], 'a', true)).toEqual(['a']);
        expect(setRight(['a'], 'b', true)).toEqual(['a', 'b']);
    });

    it('revokes a right', () => {
        expect(setRight(['a', 'b'], 'a', false)).toEqual(['b']);
    });
});

describe('inOrder', () => {
    it('puts rights in the given order, whatever order they came in', () => {
        expect(inOrder(['a', 'b', 'c'], ['c', 'a'])).toEqual(['a', 'c']);
    });

    it('makes a right toggled off and on again equal to the start', () => {
        const start = ['a', 'b'];
        const toggled = setRight(setRight(start, 'a', false), 'a', true);

        expect(toggled).not.toEqual(start);
        expect(inOrder(['a', 'b'], toggled)).toEqual(start);
    });
});

describe('visibleNavGroups', () => {
    const groups: NavGroup[] = [
        {
            title: 'Algemeen',
            items: [
                { title: 'Dashboard', href: '/dashboard' },
                {
                    title: 'Gebruikers',
                    href: '/users',
                    permission: 'manage_users',
                },
            ],
        },
        {
            title: 'Beheer',
            items: [
                {
                    title: 'Gebruikers',
                    href: '/users',
                    permission: 'manage_users',
                },
            ],
        },
    ];

    it('shows an item with a permission only to who has it', () => {
        expect(visibleNavGroups(groups, ['manage_users'])).toEqual(groups);
        expect(
            visibleNavGroups(groups, [])[0].items.map((item) => item.title),
        ).toEqual(['Dashboard']);
    });

    it('drops a group with nothing left to show', () => {
        expect(visibleNavGroups(groups, []).map((g) => g.title)).toEqual([
            'Algemeen',
        ]);
    });
});
