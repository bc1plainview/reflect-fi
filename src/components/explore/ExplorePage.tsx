import { useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import { Search, SearchX, RefreshCw } from 'lucide-react';
import { useTokenRegistry } from '../../hooks/useTokenRegistry';
import { TokenCard } from '../token/TokenCard';
import { formatNumber } from '../../utils/formatting';
import type { LaunchedToken } from '../../config/contracts';

type SortOption = 'newest' | 'holders' | 'transfers' | 'reflected' | 'tax-high' | 'tax-low';

export function ExplorePage(): ReactNode {
    const { tokens, stats, scanning } = useTokenRegistry();
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState<SortOption>('newest');

    const filteredTokens = useMemo(() => {
        let result = tokens;

        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (t) =>
                    t.name.toLowerCase().includes(q) ||
                    t.symbol.toLowerCase().includes(q) ||
                    t.contractAddress.toLowerCase().includes(q),
            );
        }

        const sorters: Record<SortOption, (a: LaunchedToken, b: LaunchedToken) => number> = {
            newest: (a, b) => b.deployedAt - a.deployedAt,
            holders: (a, b) => b.holders - a.holders,
            transfers: (a, b) => b.transfers - a.transfers,
            reflected: (a, b) => Number(b.totalReflected) - Number(a.totalReflected),
            'tax-high': (a, b) => b.taxBasisPoints - a.taxBasisPoints,
            'tax-low': (a, b) => a.taxBasisPoints - b.taxBasisPoints,
        };
        result = [...result].sort(sorters[sort]);

        return result;
    }, [tokens, search, sort]);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Explore Tokens</h1>
                <p className="page-subtitle">
                    Discover all reflection tokens launched on reflect.fi
                </p>
            </div>

            {/* Stats Overview */}
            <div className="stat-grid reveal">
                <div className="stat-card">
                    <div className="stat-label">Total Tokens</div>
                    <div className="stat-value">{stats.totalTokens}</div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Total Reflected</div>
                    <div className="stat-value" style={{ color: 'var(--accent-green)' }}>
                        {formatNumber(stats.totalReflected.toString())}
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-label">Avg Tax Rate</div>
                    <div className="stat-value">
                        {tokens.length > 0
                            ? `${(tokens.reduce((sum, t) => sum + t.taxBasisPoints, 0) / tokens.length / 100).toFixed(1)}%`
                            : '0%'}
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar reveal">
                <div className="search-wrapper">
                    <span className="search-icon"><Search size={16} /></span>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search by name, symbol, or address..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="sort-select"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                >
                    <option value="newest">Newest First</option>
                    <option value="holders">Most Holders</option>
                    <option value="transfers">Most Transfers</option>
                    <option value="reflected">Most Reflected</option>
                    <option value="tax-high">Highest Tax</option>
                    <option value="tax-low">Lowest Tax</option>
                </select>
            </div>

            {/* Scanning Indicator */}
            {scanning && (
                <div className="reveal" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '14px 20px',
                    marginBottom: '24px',
                    borderRadius: '12px',
                    background: 'rgba(0, 209, 255, 0.06)',
                    border: '1px solid rgba(0, 209, 255, 0.15)',
                    color: 'var(--accent-cyan)',
                    fontSize: '0.875rem',
                }}>
                    <RefreshCw size={16} style={{ animation: 'spin 1.5s linear infinite' }} />
                    Scanning blockchain for tokens...
                </div>
            )}

            {/* Token Grid */}
            {filteredTokens.length > 0 ? (
                <div className="token-grid">
                    {filteredTokens.map((token) => (
                        <TokenCard key={token.contractAddress} token={token} />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <div className="empty-icon">
                        <SearchX size={28} />
                    </div>
                    <div className="empty-title">No tokens found</div>
                    <div className="empty-description">
                        {search
                            ? 'Try adjusting your search query'
                            : 'Be the first to launch a reflection token!'}
                    </div>
                </div>
            )}

            <div style={{ height: '80px' }} />
        </div>
    );
}
