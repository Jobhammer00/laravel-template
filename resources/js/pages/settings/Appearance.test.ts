// @vitest-environment happy-dom
import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Appearance from '@/pages/settings/Appearance.vue';

vi.mock('@inertiajs/vue3', async (original) => ({
    ...(await original<Record<string, unknown>>()),
    Head: { render: () => null },
}));

const stored = new Map<string, string>();

beforeEach(() => {
    vi.stubGlobal('localStorage', {
        getItem: (key: string) => stored.get(key) ?? null,
        setItem: (key: string, value: string) => stored.set(key, value),
    });
    vi.stubGlobal('matchMedia', () => ({ matches: false }));
});

afterEach(() => {
    stored.clear();
    vi.unstubAllGlobals();
    document.documentElement.classList.remove('dark');
});

const checked = (wrapper: ReturnType<typeof mount>): string =>
    wrapper.find('[role=radio][aria-checked=true]').text();

describe('settings Appearance', () => {
    it('marks the theme saved on this device', async () => {
        stored.set('appearance', 'dark');
        const wrapper = mount(Appearance);
        await flushPromises();

        expect(checked(wrapper)).toBe('Donker');
    });

    it('switches to the chosen theme and remembers it', async () => {
        const wrapper = mount(Appearance);
        await wrapper.findAll('[role=radio]')[0].trigger('click');
        expect(checked(wrapper)).toBe('Licht');
        expect(document.documentElement.classList.contains('dark')).toBe(false);

        await wrapper.findAll('[role=radio]')[1].trigger('click');

        expect(checked(wrapper)).toBe('Donker');
        expect(stored.get('appearance')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
    });
});
