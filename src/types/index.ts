export type { LaunchedToken } from '../config/contracts';

export interface TokenDeployParams {
    name: string;
    symbol: string;
    maxSupply: string;
    decimals: number;
    taxBasisPoints: number;
}
