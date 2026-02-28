// Launchpad fee recipient address
export const LAUNCHPAD_FEE_ADDRESS = 'opt1pcluu8yypmu3ylynk8vdxv44snyjmyff2f9j9vehggcfrunnmqkfq4phqrv';

// Launchpad fee in satoshis
export const LAUNCHPAD_FEE_SATS = 15_000n;

// Token registry — tracks all tokens launched via reflect.fi
// In production this would be indexed from on-chain events via the OPNet RPC
export interface LaunchedToken {
    contractAddress: string;
    name: string;
    symbol: string;
    decimals: number;
    maxSupply: string;
    taxBasisPoints: number;
    deployer: string;
    deployedAt: number;
    totalReflected: string;
    holders: number;
    transfers: number;
}
