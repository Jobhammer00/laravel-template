import { usePage } from '@inertiajs/vue3';
import { describe, expect, it, vi } from 'vitest';
import { useCurrentUrl } from '@/composables/useCurrentUrl';

vi.mock('@inertiajs/vue3', async () => {
    const page = (await import('vue')).reactive({ url: '/' });

    return { usePage: () => page };
});

const page = usePage();

describe('useCurrentUrl', () => {
    it('reads the path of the current page without its query string', () => {
        page.url = '/users/5/edit?tab=rights';

        expect(useCurrentUrl().currentUrl.value).toBe('/users/5/edit');
    });

    it('matches a path or route exactly, and an absolute url by its path', () => {
        const { isCurrentUrl } = useCurrentUrl();

        expect(isCurrentUrl('/users', '/users')).toBe(true);
        expect(isCurrentUrl({ url: '/users', method: 'get' }, '/users')).toBe(
            true,
        );
        expect(isCurrentUrl('/users', '/users/5')).toBe(false);
        expect(isCurrentUrl('https://example.com/users', '/users')).toBe(true);
    });

    it('does not match a url it cannot parse', () => {
        expect(useCurrentUrl().isCurrentUrl('http://', '/users')).toBe(false);
    });

    it('matches a parent path for the pages below it', () => {
        const { isCurrentOrParentUrl } = useCurrentUrl();

        expect(isCurrentOrParentUrl('/users', '/users/5/edit')).toBe(true);
        expect(isCurrentOrParentUrl('/products', '/users/5/edit')).toBe(false);
    });

    it('returns the value for the current page and the fallback otherwise', () => {
        page.url = '/dashboard';
        const { whenCurrentUrl } = useCurrentUrl();

        expect(whenCurrentUrl('/dashboard', 'active')).toBe('active');
        expect(whenCurrentUrl('/users', 'active')).toBeNull();
        expect(whenCurrentUrl('/users', 'active', 'idle')).toBe('idle');
    });
});
