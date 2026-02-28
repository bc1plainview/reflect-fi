import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { Wallet } from 'lucide-react';
import { formatAddress } from '../../utils/formatting';

export function Navbar(): ReactNode {
    const location = useLocation();
    const { walletAddress, openConnectModal, disconnect } = useWalletConnect();
    const [menuOpen, setMenuOpen] = useState(false);

    const isActive = (path: string): string => {
        return location.pathname === path ? 'active' : '';
    };

    const closeMenu = (): void => setMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand" onClick={closeMenu}>
                    <div className="logo-icon">
                        <div className="logo-diamond" />
                    </div>
                    <span><span className="brand-gradient">reflect</span>.fi</span>
                </Link>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/" className={isActive('/')} onClick={closeMenu}>Home</Link>
                    <Link to="/launch" className={isActive('/launch')} onClick={closeMenu}>Launch</Link>
                    <Link to="/explore" className={isActive('/explore')} onClick={closeMenu}>Explore</Link>
                </div>

                <div className="navbar-actions">
                    <span className="badge badge-cyan">OPNet Testnet</span>
                    {walletAddress ? (
                        <button className="btn btn-outline btn-sm" onClick={disconnect}>
                            <Wallet size={14} />
                            {formatAddress(walletAddress, 5)}
                        </button>
                    ) : (
                        <button className="btn btn-primary btn-sm" onClick={openConnectModal}>
                            <Wallet size={14} />
                            Connect Wallet
                        </button>
                    )}
                    <button
                        className={`mobile-menu-btn ${menuOpen ? 'open' : ''}`}
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                </div>
            </div>
        </nav>
    );
}
