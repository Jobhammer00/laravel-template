import type { NavGroup } from '@/types';

export type ApplyMode = 'overwrite' | 'merge';

export const sameRights = <T extends string>(a: T[], b: T[]): boolean =>
    a.length === b.length && a.every((value) => b.includes(value));

export const rightsForRole = <T extends string>(
    current: T[],
    role: T[],
    mode: ApplyMode,
): T[] =>
    mode === 'overwrite' ? [...role] : [...new Set([...current, ...role])];

export const setRight = <T extends string>(
    current: T[],
    value: T,
    granted: boolean,
): T[] =>
    granted
        ? [...new Set([...current, value])]
        : current.filter((permission) => permission !== value);

export const inOrder = <T extends string>(order: T[], current: T[]): T[] =>
    order.filter((value) => current.includes(value));

export const visibleNavGroups = (
    groups: NavGroup[],
    permissions: string[],
): NavGroup[] =>
    groups
        .map((group) => ({
            ...group,
            items: group.items.filter(
                (item) =>
                    !item.permission || permissions.includes(item.permission),
            ),
        }))
        .filter((group) => group.items.length > 0);
