import { router } from '@inertiajs/vue3';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'vue-sonner';
import { initializeFlashToast } from '@/lib/flashToast';

vi.mock('@inertiajs/vue3', () => ({ router: { on: vi.fn() } }));
vi.mock('vue-sonner', () => ({
    toast: {
        success: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
        error: vi.fn(),
    },
}));

let flash: (event: unknown) => void;

beforeEach(() => {
    vi.clearAllMocks();
    initializeFlashToast();
    flash = vi.mocked(router.on).mock.calls[0][1] as never;
});

describe('initializeFlashToast', () => {
    it('shows the flashed toast with its message as id, so repeats replace it', () => {
        flash({
            detail: {
                flash: { toast: { type: 'success', message: 'Opgeslagen' } },
            },
        });

        expect(router.on).toHaveBeenCalledWith('flash', expect.any(Function));
        expect(toast.success).toHaveBeenCalledWith('Opgeslagen', {
            id: 'Opgeslagen',
        });
    });

    it('shows an error toast in its own style', () => {
        flash({
            detail: {
                flash: { toast: { type: 'error', message: 'Mislukt' } },
            },
        });

        expect(toast.error).toHaveBeenCalledWith('Mislukt', { id: 'Mislukt' });
        expect(toast.success).not.toHaveBeenCalled();
    });

    it('shows nothing for flash data without a toast', () => {
        flash({ detail: { flash: { other: 'x' } } });
        flash({ detail: undefined });

        for (const show of Object.values(toast)) {
            expect(show).not.toHaveBeenCalled();
        }
    });
});
