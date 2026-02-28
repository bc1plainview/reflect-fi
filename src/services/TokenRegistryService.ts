import type { LaunchedToken } from '../config/contracts';

const STORAGE_KEY = 'reflect_fi_tokens';

/**
 * Client-side token registry.
 * Merges on-chain discovered tokens (via BlockScannerService) with
 * localStorage entries. On-chain data takes priority for metadata,
 * but localStorage preserves deployment-time fields like taxBasisPoints.
 */
class TokenRegistryService {
    private static instance: TokenRegistryService;
    private tokens: LaunchedToken[] = [];
    private listeners: Array<() => void> = [];
    private _scanning = false;
    private scanListeners: Array<(scanning: boolean) => void> = [];

    private constructor() {
        this.loadFromStorage();
    }

    public static getInstance(): TokenRegistryService {
        if (!TokenRegistryService.instance) {
            TokenRegistryService.instance = new TokenRegistryService();
        }
        return TokenRegistryService.instance;
    }

    public getAll(): LaunchedToken[] {
        return [...this.tokens].sort((a, b) => b.deployedAt - a.deployedAt);
    }

    public getByAddress(contractAddress: string): LaunchedToken | undefined {
        return this.tokens.find(
            (t) => t.contractAddress.toLowerCase() === contractAddress.toLowerCase(),
        );
    }

    public register(token: LaunchedToken): void {
        const exists = this.tokens.some(
            (t) => t.contractAddress.toLowerCase() === token.contractAddress.toLowerCase(),
        );
        if (!exists) {
            this.tokens.push(token);
            this.saveToStorage();
            this.notifyListeners();
        }
    }

    public updateStats(
        contractAddress: string,
        updates: Partial<Pick<LaunchedToken, 'totalReflected' | 'holders' | 'transfers'>>,
    ): void {
        const token = this.tokens.find(
            (t) => t.contractAddress.toLowerCase() === contractAddress.toLowerCase(),
        );
        if (token) {
            Object.assign(token, updates);
            this.saveToStorage();
            this.notifyListeners();
        }
    }

    public subscribe(listener: () => void): () => void {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }

    public mergeFromChain(chainTokens: LaunchedToken[]): void {
        let changed = false;

        for (const chainToken of chainTokens) {
            const idx = this.tokens.findIndex(
                (t) => t.contractAddress.toLowerCase() === chainToken.contractAddress.toLowerCase(),
            );

            if (idx === -1) {
                this.tokens.push(chainToken);
                changed = true;
            } else {
                const existing = this.tokens[idx];
                this.tokens[idx] = {
                    ...chainToken,
                    // Preserve localStorage-only fields when available
                    taxBasisPoints: existing.taxBasisPoints || chainToken.taxBasisPoints,
                    deployer: existing.deployer || chainToken.deployer,
                    deployedAt: existing.deployedAt || chainToken.deployedAt,
                    totalReflected: existing.totalReflected || chainToken.totalReflected,
                    holders: existing.holders || chainToken.holders,
                    transfers: existing.transfers || chainToken.transfers,
                };
                changed = true;
            }
        }

        if (changed) {
            this.saveToStorage();
            this.notifyListeners();
        }
    }

    public get scanning(): boolean {
        return this._scanning;
    }

    public setScanning(value: boolean): void {
        this._scanning = value;
        for (const listener of this.scanListeners) {
            listener(value);
        }
        this.notifyListeners();
    }

    public onScanningChange(listener: (scanning: boolean) => void): () => void {
        this.scanListeners.push(listener);
        return () => {
            this.scanListeners = this.scanListeners.filter((l) => l !== listener);
        };
    }

    public getStats(): { totalTokens: number; totalReflected: bigint } {
        let totalReflected = 0n;
        for (const token of this.tokens) {
            try {
                totalReflected += BigInt(token.totalReflected);
            } catch {
                // skip invalid values
            }
        }
        return {
            totalTokens: this.tokens.length,
            totalReflected,
        };
    }

    private notifyListeners(): void {
        for (const listener of this.listeners) {
            listener();
        }
    }

    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                this.tokens = JSON.parse(stored) as LaunchedToken[];
            }
        } catch {
            this.tokens = [];
        }
    }

    private saveToStorage(): void {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tokens));
        } catch {
            // localStorage might be full or disabled
        }
    }
}

export const tokenRegistryService = TokenRegistryService.getInstance();
