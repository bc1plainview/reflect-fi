import { IOP20Contract, getContract, OP_20_ABI, OPNetTransactionTypes, DeploymentTransaction } from 'opnet';
import type { JSONRpcProvider } from 'opnet';
import type { Network } from '@btc-vision/bitcoin';
import type { LaunchedToken } from '../config/contracts';

const LAST_SCANNED_KEY = 'reflect_fi_last_scanned_block';
const DEFAULT_SCAN_RANGE = 1000;
const BATCH_SIZE = 10;

class BlockScannerService {
    private static instance: BlockScannerService;
    private scanning = false;
    private scanListeners: Array<(scanning: boolean) => void> = [];

    private constructor() {}

    public static getInstance(): BlockScannerService {
        if (!BlockScannerService.instance) {
            BlockScannerService.instance = new BlockScannerService();
        }
        return BlockScannerService.instance;
    }

    public isScanning(): boolean {
        return this.scanning;
    }

    public onScanningChange(listener: (scanning: boolean) => void): () => void {
        this.scanListeners.push(listener);
        return () => {
            this.scanListeners = this.scanListeners.filter((l) => l !== listener);
        };
    }

    public async scanRecentBlocks(
        provider: JSONRpcProvider,
        network: Network,
        blockCount: number = DEFAULT_SCAN_RANGE,
    ): Promise<LaunchedToken[]> {
        if (this.scanning) return [];

        this.setScanning(true);
        const discovered: LaunchedToken[] = [];

        try {
            const currentBlock = await provider.getBlockNumber();
            const currentHeight = Number(currentBlock);

            const lastScanned = this.getLastScannedBlock();
            const startBlock = lastScanned > 0
                ? lastScanned + 1
                : Math.max(1, currentHeight - blockCount);

            if (startBlock > currentHeight) {
                return discovered;
            }

            const deploymentAddresses: Array<{ address: string; blockTime: number }> = [];

            for (let i = startBlock; i <= currentHeight; i += BATCH_SIZE) {
                const end = Math.min(i + BATCH_SIZE - 1, currentHeight);
                const blockNumbers: number[] = [];
                for (let b = i; b <= end; b++) {
                    blockNumbers.push(b);
                }

                try {
                    const blocks = await provider.getBlocks(blockNumbers, true);

                    for (const block of blocks) {
                        const deployments = block.deployments;
                        if (deployments && deployments.length > 0) {
                            for (const addr of deployments) {
                                const addrStr = addr.p2tr(network);
                                deploymentAddresses.push({
                                    address: addrStr,
                                    blockTime: block.time * 1000,
                                });
                            }
                        }

                        const txs = block.transactions;
                        if (txs) {
                            for (const tx of txs) {
                                if (tx.OPNetType === OPNetTransactionTypes.Deployment) {
                                    const deployTx = tx as DeploymentTransaction;
                                    if (deployTx.contractAddress) {
                                        const exists = deploymentAddresses.some(
                                            (d) => d.address.toLowerCase() === deployTx.contractAddress!.toLowerCase(),
                                        );
                                        if (!exists) {
                                            deploymentAddresses.push({
                                                address: deployTx.contractAddress,
                                                blockTime: block.time * 1000,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch {
                    // Skip failed batches, continue scanning
                }
            }

            for (const { address, blockTime } of deploymentAddresses) {
                try {
                    const contract = getContract<IOP20Contract>(
                        address,
                        OP_20_ABI,
                        provider,
                        network,
                    );

                    const [metadataResult, maxSupplyResult] = await Promise.all([
                        contract.metadata(),
                        contract.maximumSupply(),
                    ]);

                    const { name, symbol, decimals, totalSupply } = metadataResult.properties;
                    const { maximumSupply } = maxSupplyResult.properties;

                    if (!name || !symbol) continue;

                    const token: LaunchedToken = {
                        contractAddress: address,
                        name,
                        symbol,
                        decimals,
                        maxSupply: (maximumSupply ?? totalSupply).toString(),
                        taxBasisPoints: 0,
                        deployer: '',
                        deployedAt: blockTime,
                        totalReflected: '0',
                        holders: 0,
                        transfers: 0,
                    };

                    discovered.push(token);
                } catch {
                    // Not an OP20 token or call failed — skip
                }
            }

            this.setLastScannedBlock(currentHeight);
        } catch (err) {
            console.error('[BlockScanner] Scan failed:', err);
        } finally {
            this.setScanning(false);
        }

        return discovered;
    }

    private getLastScannedBlock(): number {
        try {
            const stored = localStorage.getItem(LAST_SCANNED_KEY);
            return stored ? parseInt(stored, 10) : 0;
        } catch {
            return 0;
        }
    }

    private setLastScannedBlock(block: number): void {
        try {
            localStorage.setItem(LAST_SCANNED_KEY, block.toString());
        } catch {
            // localStorage might be full or disabled
        }
    }

    private setScanning(value: boolean): void {
        this.scanning = value;
        for (const listener of this.scanListeners) {
            listener(value);
        }
    }
}

export const blockScannerService = BlockScannerService.getInstance();
