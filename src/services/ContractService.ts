import { IOP20Contract, getContract, OP_20_ABI } from 'opnet';
import { Network } from '@btc-vision/bitcoin';
import { providerService } from './ProviderService';

class ContractService {
    private static instance: ContractService;
    private contracts: Map<string, IOP20Contract> = new Map();

    private constructor() {}

    public static getInstance(): ContractService {
        if (!ContractService.instance) {
            ContractService.instance = new ContractService();
        }
        return ContractService.instance;
    }

    public getTokenContract(address: string, network: Network): IOP20Contract {
        const key = `${JSON.stringify(network)}:${address}`;

        if (!this.contracts.has(key)) {
            const provider = providerService.getProvider(network);
            const contract = getContract<IOP20Contract>(address, OP_20_ABI, provider, network);
            this.contracts.set(key, contract);
        }

        return this.contracts.get(key)!;
    }

    public clearCache(): void {
        this.contracts.clear();
    }
}

export const contractService = ContractService.getInstance();
