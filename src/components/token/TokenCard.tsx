import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeftRight, TrendingUp } from 'lucide-react';
import type { LaunchedToken } from '../../config/contracts';
import { formatNumber, formatBasisPoints, formatAddress, timeAgo } from '../../utils/formatting';

function addressToGradient(address: string): string {
    let hash = 0;
    for (let i = 0; i < address.length; i++) {
        hash = address.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash) % 360;
    const hue2 = (hue1 + 40) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 60%, 50%) 0%, hsl(${hue2}, 70%, 45%) 100%)`;
}

interface TokenCardProps {
    token: LaunchedToken;
}

export function TokenCard({ token }: TokenCardProps): ReactNode {
    const navigate = useNavigate();

    const handleClick = (): void => {
        navigate(`/token/${token.contractAddress}`);
    };

    const initials = token.symbol.slice(0, 2).toUpperCase();
    const gradient = addressToGradient(token.contractAddress);

    return (
        <div className="token-card reveal" onClick={handleClick} role="button" tabIndex={0}>
            <div className="token-card-header">
                <div className="token-icon" style={{ background: gradient }}>{initials}</div>
                <div>
                    <div className="token-name">{token.name}</div>
                    <div className="token-symbol">${token.symbol}</div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <span className="tax-badge">
                        {formatBasisPoints(token.taxBasisPoints)} tax
                    </span>
                </div>
            </div>

            <div className="token-stats">
                <div>
                    <div className="token-stat-label"><Users size={12} /> Holders</div>
                    <div className="token-stat-value">{formatNumber(token.holders)}</div>
                </div>
                <div>
                    <div className="token-stat-label"><ArrowLeftRight size={12} /> Transfers</div>
                    <div className="token-stat-value">{formatNumber(token.transfers)}</div>
                </div>
                <div>
                    <div className="token-stat-label"><TrendingUp size={12} /> Reflected</div>
                    <div className="token-stat-value" style={{ color: 'var(--accent-green)' }}>
                        {formatNumber(token.totalReflected)}
                    </div>
                </div>
            </div>

            <div className="deployer-tag">
                {formatAddress(token.deployer)} &middot; {timeAgo(token.deployedAt)}
            </div>
        </div>
    );
}
