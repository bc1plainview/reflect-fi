/**
 * ReflectToken ABI definition for use with OPNet's getContract().
 *
 * This extends OP_20_ABI with the custom reflection methods:
 * - taxRate(): view — returns the tax basis points
 * - totalReflected(): view — returns cumulative reflected amount
 * - isExcluded(address): view — checks if address is excluded from reflections
 * - excludeFromReflection(address): method — owner only
 * - includeInReflection(address): method — owner only
 */
export const REFLECT_TOKEN_ABI = [
    // OP20 standard methods are inherited from OP_20_ABI
    // Custom reflection methods:
    {
        name: 'taxRate',
        inputs: [],
        outputs: [{ name: 'taxBasisPoints', type: 'uint256' }],
        type: 'function',
        stateMutability: 'view',
    },
    {
        name: 'totalReflected',
        inputs: [],
        outputs: [{ name: 'totalReflected', type: 'uint256' }],
        type: 'function',
        stateMutability: 'view',
    },
    {
        name: 'isExcluded',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: 'isExcluded', type: 'bool' }],
        type: 'function',
        stateMutability: 'view',
    },
    {
        name: 'excludeFromReflection',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: 'success', type: 'bool' }],
        type: 'function',
        stateMutability: 'nonpayable',
    },
    {
        name: 'includeInReflection',
        inputs: [{ name: 'account', type: 'address' }],
        outputs: [{ name: 'success', type: 'bool' }],
        type: 'function',
        stateMutability: 'nonpayable',
    },
] as const;
