// @vitest-environment happy-dom
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import type { UseAppearanceReturn } from '@/composables/useAppearance';
import {
    initializeTheme,
    updateTheme,
    useAppearance,
} from '@/composables/useAppearance';

const system = vi.hoisted(() => ({
    dark: false,
    listeners: [] as (() => void)[],
}));

const stored = new Map<string, string>();
const localStorage = {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value),
    removeItem: (key: string) => stored.delete(key),
};

beforeEach(() => {
    vi.stubGlobal('localStorage', localStorage);
    vi.stubGlobal('matchMedia', () => ({
        get matches() {
            return system.dark;
        },
        addEventListener: (_event: string, listener: () => void) =>
            system.listeners.push(listener),
    }));
});

afterEach(() => {
    vi.unstubAllGlobals();
    stored.clear();
    document.cookie = 'appearance=;max-age=0;path=/';
    document.documentElement.classList.remove('dark');
    system.dark = false;
    system.listeners = [];
});

const isDark = (): boolean =>
    document.documentElement.classList.contains('dark');

const mountAppearance = (): UseAppearanceReturn => {
    let appearance!: UseAppearanceReturn;
    mount(
        defineComponent({
            setup() {
                appearance = useAppearance();

                return () => h('div');
            },
        }),
    );

    return appearance;
};

describe('updateTheme', () => {
    it('applies a chosen theme regardless of the system', () => {
        system.dark = true;

        updateTheme('light');
        expect(isDark()).toBe(false);

        updateTheme('dark');
        expect(isDark()).toBe(true);
    });

    it('follows the system for the system theme', () => {
        system.dark = true;
        updateTheme('system');
        expect(isDark()).toBe(true);

        system.dark = false;
        updateTheme('system');
        expect(isDark()).toBe(false);
    });
});

describe('initializeTheme', () => {
    it('applies the saved theme and follows system changes when none is saved', () => {
        localStorage.setItem('appearance', 'dark');
        initializeTheme();
        expect(isDark()).toBe(true);

        localStorage.removeItem('appearance');
        system.dark = false;
        system.listeners.forEach((listener) => listener());

        expect(isDark()).toBe(false);
    });
});

describe('useAppearance', () => {
    it('starts from the saved appearance', () => {
        localStorage.setItem('appearance', 'dark');

        expect(mountAppearance().appearance.value).toBe('dark');
    });

    it('stores a new appearance on the device and applies it', () => {
        const { appearance, resolvedAppearance, updateAppearance } =
            mountAppearance();

        updateAppearance('dark');

        expect(appearance.value).toBe('dark');
        expect(resolvedAppearance.value).toBe('dark');
        expect(localStorage.getItem('appearance')).toBe('dark');
        expect(document.cookie).toContain('appearance=dark');
        expect(isDark()).toBe(true);
    });

    it('resolves the system appearance to what the system prefers', () => {
        const { resolvedAppearance, updateAppearance } = mountAppearance();
        system.dark = true;

        updateAppearance('system');

        expect(resolvedAppearance.value).toBe('dark');
    });
});
