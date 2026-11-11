import { afterEach, describe, expect, it, vi } from 'vitest';
import { useTwoFactorAuth } from '@/composables/useTwoFactorAuth';

const submit = vi.hoisted(() => vi.fn());

vi.mock('@inertiajs/vue3', () => ({
    useHttp: () => ({ submit }),
}));

const respond = (responses: Record<string, unknown>): void => {
    submit.mockImplementation(async ({ url }: { url: string }) => {
        const response = responses[url];

        if (response instanceof Error) {
            throw response;
        }

        return response;
    });
};

afterEach(() => {
    useTwoFactorAuth().clearTwoFactorAuthData();
    submit.mockReset();
});

describe('useTwoFactorAuth', () => {
    it('fetches the QR code and the setup key together', async () => {
        respond({
            '/user/two-factor-qr-code': { svg: '<svg/>', url: 'otpauth://' },
            '/user/two-factor-secret-key': { secretKey: 'ABCD' },
        });
        const twoFactor = useTwoFactorAuth();

        await twoFactor.fetchSetupData();

        expect(twoFactor.qrCodeSvg.value).toBe('<svg/>');
        expect(twoFactor.manualSetupKey.value).toBe('ABCD');
        expect(twoFactor.hasSetupData.value).toBe(true);
        expect(twoFactor.errors.value).toEqual([]);
    });

    it('reports each part of the setup that fails to load', async () => {
        respond({
            '/user/two-factor-qr-code': new Error('500'),
            '/user/two-factor-secret-key': new Error('500'),
        });
        const twoFactor = useTwoFactorAuth();

        await twoFactor.fetchSetupData();

        expect(twoFactor.errors.value).toEqual([
            'Failed to fetch QR code',
            'Failed to fetch a setup key',
        ]);
        expect(twoFactor.hasSetupData.value).toBe(false);
    });

    it('clears the setup data and its errors', async () => {
        respond({
            '/user/two-factor-qr-code': { svg: '<svg/>', url: '' },
            '/user/two-factor-secret-key': new Error('500'),
        });
        const twoFactor = useTwoFactorAuth();
        await twoFactor.fetchSetupData();

        twoFactor.clearSetupData();

        expect(twoFactor.qrCodeSvg.value).toBeNull();
        expect(twoFactor.errors.value).toEqual([]);
    });

    it('loads the recovery codes and forgets them on clearing', async () => {
        respond({ '/user/two-factor-recovery-codes': ['one', 'two'] });
        const twoFactor = useTwoFactorAuth();

        await twoFactor.fetchRecoveryCodes();

        expect(twoFactor.recoveryCodesList.value).toEqual(['one', 'two']);

        twoFactor.clearTwoFactorAuthData();

        expect(twoFactor.recoveryCodesList.value).toEqual([]);
    });

    it('reports recovery codes that fail to load', async () => {
        respond({ '/user/two-factor-recovery-codes': new Error('500') });
        const twoFactor = useTwoFactorAuth();

        await twoFactor.fetchRecoveryCodes();

        expect(twoFactor.recoveryCodesList.value).toEqual([]);
        expect(twoFactor.errors.value).toEqual([
            'Failed to fetch recovery codes',
        ]);
    });
});
