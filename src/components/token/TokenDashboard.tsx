import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { getContract, OP_20_ABI } from 'opnet';
import type { IOP20Contract } from 'opnet';
import { FileQuestion, Zap, Coins, Sprout } from 'lucide-react';
import { useTokenRegistry } from '../../hooks/useTokenRegistry';
import { StatCard } from '../common/StatCard';
import { formatNumber, formatBasisPoints, timeAgo } from '../../utils/formatting';

function addressToGradient(address: string): string {
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        hash = address.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 60%, 50%) 0%, hsl(${hue2}, 70%, 45%) 100%)`;
}

interface LiveData {
    totalSupply: string;
    totalReflected: string;
    taxRate: string;
    loading: boolean;
    error: string;
}

export function TokenDashboard(): ReactNode {
    const { address } = useParams<{ address: string }>();
    const { getToken } = useTokenRegistry();
    const { provider } = useWalletConnect();
    const [liveData, setLiveData] = useState<LiveData>({
        totalSupply: '0',
        totalReflected: '0',
        taxRate: '0',
        loading: true,
        error: '',
    });

    const token = address ? getToken(address) : undefined;

    useEffect(() => {
        if (!address || !provider) {
            setLiveData((prev) => ({ ...prev, loading: false }));
            return;
        }

        let cancelled = false;

        async function fetchLiveData(): Promise<void> {
            try {
                const network = provider!.getNetwork();
                const contract = getContract<IOP20Contract>(address!, OP_20_ABI, provider!, network);

                const supplyResult = await contract.totalSupply();
                const totalSupply = supplyResult.properties?.totalSupply?.toString() ?? '0';

                if (!cancelled) {
                    setLiveData({
                        totalSupply,
                        totalReflected: token?.totalReflected ?? '0',
                        taxRate: token ? formatBasisPoints(token.taxBasisPoints) : '0%',
                        loading: false,
                        error: '',
                    });
                }
            } catch {
                if (!cancelled) {
                    setLiveData((prev) => ({
                        ...prev,
                        loading: false,
                        error: 'Could not fetch live data',
                    }));
                }
            }
        }

        fetchLiveData();
        return () => { cancelled = true; };
    }, [address, provider, token]);

    if (!token) {
        return (
            <div className="page-container">
                <div className="empty-state">
                    <div className="empty-icon">
                        <FileQuestion size={28} />
                    </div>
                    <div className="empty-title">Token Not Found</div>
                    <div className="empty-description">
                        This token address doesn't exist in the reflect.fi registry.
                    </div>
                    <Link to="/explore" className="btn btn-primary" style={{ marginTop: '24px' }}>
                        Browse Tokens
                    </Link>
                </div>
            </div>
        );
    }

    const taxPercent = formatBasisPoints(token.taxBasisPoints);
    const initials = token.symbol.slice(0, 2).toUpperCase();
    const gradient = addressToGradient(token.contractAddress);

    return (
        <div className="page-container">
            {/* Header */}
            <div style={{ padding: '32px 0 8px' }}>
                <Link to="/explore" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    &larr; Back to Explore
                </Link>
            </div>

            <div className="dashboard-header reveal">
                <div className="dashboard-icon animate-pulse-glow" style={{ background: gradient }}>{initials}</div>
                <div className="dashboard-info">
                    <h1>{token.name}</h1>
                    <div className="dashboard-meta">
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${token.symbol}</span>
                        <span className="tax-badge">{taxPercent} reflection tax</span>
                        <span>{timeAgo(token.deployedAt)}</span>
                    </div>
                    <div className="dashboard-address">{token.contractAddress}</div>
                </div>
            </div>

            {/* Key Stats */}
            <div className="stat-grid reveal">
                <StatCard
                    label="Reflection Tax"
                    value={taxPercent}
                />
                <StatCard
                    label="Total Reflected"
                    value={liveData.loading ? '...' : formatNumber(liveData.totalReflected)}
                />
                <StatCard
                    label="Holders"
                    value={formatNumber(token.holders)}
                />
                <StatCard
                    label="Transfers"
                    value={formatNumber(token.transfers)}
                />
            </div>

            {liveData.error && (
                <div style={{
                    padding: '12px 16px',
                    background: 'rgba(234, 179, 8, 0.08)',
                    border: '1px solid rgba(234, 179, 8, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    color: '#eab308',
                    fontSize: '0.85rem',
                    marginBottom: '16px',
                }}>
                    {liveData.error} — Showing cached data from deployment.
                </div>
            )}

            {/* Token Details Grid */}
            <div className="dashboard-grid reveal">
                {/* Token Info Card */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Token Info</h3>
                    </div>
                    <div style={{ display: 'grid', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Max Supply</span>
                            <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums' }}>
                                {parseInt(token.maxSupply).toLocaleString()}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Decimals</span>
                            <span style={{ fontWeight: 600 }}>{token.decimals}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tax per Transfer</span>
                            <span style={{ fontWeight: 600, color: 'var(--accent-purple-light)' }}>{taxPercent}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Standard</span>
                            <span className="badge badge-purple">OP20</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Network</span>
                            <span className="badge badge-cyan">OPNet Testnet</span>
                        </div>
                    </div>
                </div>

                {/* Deployer Info Card */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Deployer</h3>
                    </div>
                    <div style={{ display: 'grid', gap: '14px' }}>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>Address</div>
                            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                                {token.deployer}
                            </div>
                        </div>
                        <div>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '6px' }}>Deployed</div>
                            <div>{new Date(token.deployedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* How Reflections Work */}
            <div className="card reveal" style={{ marginTop: '24px', marginBottom: '80px' }}>
                <div className="card-header">
                    <h3 className="card-title">How Reflections Work</h3>
                </div>
                <div className="reflections-grid">
                    <div className="reflection-step">
                        <div className="icon-box purple" style={{ marginBottom: '8px' }}>
                            <Zap size={22} />
                        </div>
                        <div className="reflection-step-title">Transfer Initiated</div>
                        <div className="reflection-step-desc">
                            Sender transfers tokens. The {taxPercent} tax is calculated automatically.
                        </div>
                    </div>
                    <div className="reflection-step">
                        <div className="icon-box cyan" style={{ marginBottom: '8px' }}>
                            <Coins size={22} />
                        </div>
                        <div className="reflection-step-title">Tax Deducted</div>
                        <div className="reflection-step-desc">
                            The tax amount is removed from the transfer and enters the reflection pool.
                        </div>
                    </div>
                    <div className="reflection-step">
                        <div className="icon-box green" style={{ marginBottom: '8px' }}>
                            <Sprout size={22} />
                        </div>
                        <div className="reflection-step-title">Instant Distribution</div>
                        <div className="reflection-step-desc">
                            All holders see their balance increase proportionally. No claiming needed.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
