import { useState, useEffect, useCallback } from 'react';
import { networks, Network } from '@btc-vision/bitcoin';
import { contractService } from '../services/ContractService';
import { providerService } from '../services/ProviderService';

export function useNetwork(): {
    network: Network;
    switchNetwork: (n: Network) => void;
    networkName: string;
} {
    const [network, setNetwork] = useState<Network>(networks.opnetTestnet);

    const switchNetwork = useCallback((newNetwork: Network) => {
        contractService.clearCache();
        providerService.clearCache();
        setNetwork(newNetwork);
    }, []);

    const networkName =
        network === networks.bitcoin
            ? 'Mainnet'
            : network === networks.opnetTestnet
              ? 'Testnet'
              : 'Regtest';

    return { network, switchNetwork, networkName };
}
