export function formatAddress(address: string, chars: number = 6): string {
    if (address.length <= chars * 2 + 3) return address;
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatNumber(value: number | bigint | string, decimals: number = 2): string {
    const num = typeof value === 'string' ? parseFloat(value) : Number(value);
    if (isNaN(num)) return '0';

    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(decimals)}B`;
    }
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(decimals)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(decimals)}K`;
    }
    return num.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

export function formatBasisPoints(bps: number): string {
    return `${(bps / 100).toFixed(2)}%`;
}

export function formatSats(sats: bigint | number): string {
    const satNum = typeof sats === 'bigint' ? Number(sats) : sats;
    const btc = satNum / 100_000_000;
    if (btc >= 0.01) {
        return `${btc.toFixed(8)} BTC`;
    }
    return `${satNum.toLocaleString()} sats`;
}

export function timeAgo(timestamp: number): string {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 2592000)}mo ago`;
}
