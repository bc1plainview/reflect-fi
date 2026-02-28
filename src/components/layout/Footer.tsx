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
                            <a href="https://motoswap.org" target="_blank" rel="noopener noreferrer">MotoSwap</a>
                            <a href="https://vibecode.finance" target="_blank" rel="noopener noreferrer">vibecode.finance</a>
                            <a href="https://opscan.org" target="_blank" rel="noopener noreferrer">OPScan</a>
                            <a href="https://mempool.opnet.org" target="_blank" rel="noopener noreferrer">OPNet Mempool</a>
                            <a href="https://x.com/bc1plainview" target="_blank" rel="noopener noreferrer">@bc1plainview</a>
                        </div>
                    </div>
                </div>

                <div className="footer-danny">
                    <p className="footer-danny-text">
                        i built this on a six hour stream while making four other dapps at the same
                        time. brand new mac mini, set it up an hour before going live, nothing on it
                        but claude code and the opnet bob mcp. i&apos;m not a dev. i&apos;m a script kitty at
                        best. but that&apos;s the whole point man — you don&apos;t need to be one anymore. you
                        just need ideas and the willingness to sit down and vibe with the thing until
                        it works. bitcoin layer one. no gas tokens. no side chains. just bitcoin.
                        go build something.
                    </p>
                    <a
                        href="https://x.com/bc1plainview"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-danny-sig"
                    >
                        — danny
                    </a>
                </div>

                <div className="footer-bottom">
                    <span>Built on Bitcoin L1 with OPNet</span>
                    <span>reflect.fi</span>
                </div>
            </div>
        </footer>
    );
}
