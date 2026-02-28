import { JSONRpcProvider } from 'opnet';
import { networks, Network } from '@btc-vision/bitcoin';

class ProviderService {
    private static instance: ProviderService;
    private providers: Map<string, JSONRpcProvider> = new Map();

    private constructor() {}

    public static getInstance(): ProviderService {
        if (!ProviderService.instance) {
            ProviderService.instance = new ProviderService();
        }
        return ProviderService.instance;
    }

    public getProvider(network: Network): JSONRpcProvider {
        const networkId = this.getNetworkId(network);
        if (!this.providers.has(networkId)) {
            const rpcUrl = this.getRpcUrl(network);
            const provider = new JSONRpcProvider({ url: rpcUrl, network });
            this.providers.set(networkId, provider);
        }
        return this.providers.get(networkId)!;
    }

    public clearCache(): void {
        this.providers.clear();
    }

    private getRpcUrl(network: Network): string {
        if (network === networks.bitcoin) {
            return 'https://mainnet.opnet.org';
        } else if (network === networks.opnetTestnet) {
            return 'https://testnet.opnet.org';
        } else if (network === networks.regtest) {
            return 'http://localhost:9001';
        }
        throw new Error('Unsupported network');
    }

    private getNetworkId(network: Network): string {
        if (network === networks.bitcoin) return 'mainnet';
        if (network === networks.opnetTestnet) return 'testnet';
        if (network === networks.regtest) return 'regtest';
        return 'unknown';
    }
}

export const providerService = ProviderService.getInstance();
