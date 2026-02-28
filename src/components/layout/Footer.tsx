import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export function Footer(): ReactNode {
    return (
        <footer className="footer reveal">
            <div className="footer-inner">
                <div className="footer-grid">
                    <div className="footer-brand-col">
                        <div className="footer-brand">
                            <span className="brand-gradient">reflect</span>.fi
                        </div>
                        <p className="footer-tagline">
                            The first reflection token launchpad on Bitcoin L1, powered by OPNet smart contracts.
                        </p>
                    </div>

                    <div>
                        <div className="footer-col-title">Navigate</div>
                        <div className="footer-col-links">
                            <Link to="/">Home</Link>
                            <Link to="/launch">Launch a Token</Link>
                            <Link to="/explore">Explore Tokens</Link>
                        </div>
                    </div>

                    <div>
                        <div className="footer-col-title">Resources</div>
                        <div className="footer-col-links">
                            <a href="https://opnet.org" target="_blank" rel="noopener noreferrer">OPNet</a>
                            <a href="https://vibecode.finance" target="_blank" rel="noopener noreferrer">vibecode.finance</a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <span>Built on Bitcoin L1 with OPNet</span>
                    <span>reflect.fi</span>
                </div>
            </div>
        </footer>
    );
}
