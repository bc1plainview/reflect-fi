import { useState, useEffect, useCallback, useRef } from 'react';
import { networks } from '@btc-vision/bitcoin';
import { tokenRegistryService } from '../services/TokenRegistryService';
import { blockScannerService } from '../services/BlockScannerService';
import { providerService } from '../services/ProviderService';
import type { LaunchedToken } from '../config/contracts';

export function useTokenRegistry(): {
    tokens: LaunchedToken[];
    getToken: (address: string) => LaunchedToken | undefined;
    registerToken: (token: LaunchedToken) => void;
    stats: { totalTokens: number; totalReflected: bigint };
    scanning: boolean;
} {
    const [tokens, setTokens] = useState<LaunchedToken[]>(tokenRegistryService.getAll());
    const [scanning, setScanning] = useState(blockScannerService.isScanning());
    const scanTriggered = useRef(false);

    useEffect(() => {
        const unsubscribe = tokenRegistryService.subscribe(() => {
            setTokens(tokenRegistryService.getAll());
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = blockScannerService.onScanningChange(setScanning);
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (scanTriggered.current) return;
        scanTriggered.current = true;

        const network = networks.opnetTestnet;
        const provider = providerService.getProvider(network);

        tokenRegistryService.setScanning(true);

        blockScannerService
            .scanRecentBlocks(provider, network)
            .then((discovered) => {
                if (discovered.length > 0) {
                    tokenRegistryService.mergeFromChain(discovered);
                }
            })
            .catch((err) => {
                console.error('[useTokenRegistry] Scan error:', err);
            })
            .finally(() => {
                tokenRegistryService.setScanning(false);
            });
    }, []);

    const getToken = useCallback((address: string) => {
        return tokenRegistryService.getByAddress(address);
    }, []);

    const registerToken = useCallback((token: LaunchedToken) => {
        tokenRegistryService.register(token);
    }, []);

    const stats = tokenRegistryService.getStats();

    return { tokens, getToken, registerToken, stats, scanning };
}
