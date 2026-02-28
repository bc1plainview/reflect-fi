import { networks, Network } from '@btc-vision/bitcoin';

export interface NetworkConfig {
    name: string;
    rpcUrl: string;
    explorerUrl: string;
}

export const NETWORK_CONFIGS: Map<Network, NetworkConfig> = new Map([
    [networks.bitcoin, {
        name: 'Mainnet',
        rpcUrl: 'https://mainnet.opnet.org',
        explorerUrl: 'https://explorer.opnet.org',
    }],
    [networks.opnetTestnet, {
        name: 'OPNet Testnet',
        rpcUrl: 'https://testnet.opnet.org',
        explorerUrl: 'https://testnet-explorer.opnet.org',
    }],
    [networks.regtest, {
        name: 'Regtest',
        rpcUrl: 'http://localhost:9001',
        explorerUrl: 'http://localhost:3000',
    }],
]);

export const DEFAULT_NETWORK: Network = networks.opnetTestnet;

export function getNetworkConfig(network: Network): NetworkConfig {
    const config = NETWORK_CONFIGS.get(network);
    if (!config) {
        throw new Error('Unsupported network');
    }
    return config;
}
