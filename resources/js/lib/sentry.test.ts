// @vitest-environment happy-dom
import * as Sentry from '@sentry/vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { App } from 'vue';
import { initializeSentry } from '@/lib/sentry';

vi.mock('@sentry/vue', () => ({ init: vi.fn() }));

const app = {} as App;

function meta(name: string, content: string): void {
    const tag = document.createElement('meta');
    tag.name = name;
    tag.content = content;
    document.head.appendChild(tag);
}

afterEach(() => {
    document.head.innerHTML = '';
    vi.mocked(Sentry.init).mockClear();
});

describe('initializeSentry', () => {
    it('starts Sentry with the DSN, environment and release from the page', () => {
        meta('sentry-dsn', 'https://key@sentry.example/1');
        meta('sentry-environment', 'acceptance');
        meta('sentry-release', 'abc123');

        initializeSentry(app);

        expect(Sentry.init).toHaveBeenCalledWith({
            app,
            dsn: 'https://key@sentry.example/1',
            environment: 'acceptance',
            release: 'abc123',
        });
    });

    it('leaves out an empty environment and release', () => {
        meta('sentry-dsn', 'https://key@sentry.example/1');
        meta('sentry-environment', '');

        initializeSentry(app);

        expect(Sentry.init).toHaveBeenCalledWith(
            expect.objectContaining({
                environment: undefined,
                release: undefined,
            }),
        );
    });

    it('stays off without a DSN', () => {
        meta('sentry-dsn', '');

        initializeSentry(app);

        expect(Sentry.init).not.toHaveBeenCalled();
    });
});
