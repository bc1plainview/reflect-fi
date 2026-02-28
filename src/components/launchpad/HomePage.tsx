import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, Shield, RefreshCw, Target, Rocket } from 'lucide-react';
import { useTokenRegistry } from '../../hooks/useTokenRegistry';
import { TokenCard } from '../token/TokenCard';
import { formatNumber } from '../../utils/formatting';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
    }),
};

export function HomePage(): ReactNode {
    const { tokens, stats, scanning } = useTokenRegistry();
    const recentTokens = tokens.slice(0, 3);

    return (
        <>
            {/* Hero */}
            <section className="hero">
                <div className="page-container">
                    <div className="hero-content">
                        <motion.div
                            className="hero-badge"
                            initial="hidden"
                            animate="visible"
                            custom={0}
                            variants={fadeUp}
                        >
                            <Zap size={16} /> Powered by OPNet on Bitcoin L1
                        </motion.div>
                        <motion.h1
                            className="hero-title"
                            initial="hidden"
                            animate="visible"
                            custom={1}
                            variants={fadeUp}
                        >
                            Launch <span className="gradient-text">Reflection Tokens</span>
                            <br />on Bitcoin
                        </motion.h1>
                        <motion.p
                            className="hero-description"
                            initial="hidden"
                            animate="visible"
                            custom={2}
                            variants={fadeUp}
                        >
                            Create OP20 tokens with built-in holder rewards. Every transfer automatically
                            distributes a customizable tax to all holders — no staking, no claiming, just hold and earn.
                        </motion.p>
                        <motion.div
                            className="hero-actions"
                            initial="hidden"
                            animate="visible"
                            custom={3}
                            variants={fadeUp}
                        >
                            <Link to="/launch" className="btn btn-primary btn-lg">
                                <Rocket size={18} />
                                Launch a Token
                            </Link>
                            <Link to="/explore" className="btn btn-secondary btn-lg">
                                Explore Tokens
                            </Link>
                        </motion.div>

                        <motion.div
                            className="hero-stats"
                            initial="hidden"
                            animate="visible"
                            custom={4}
                            variants={fadeUp}
                        >
                            <div>
                                <div className="hero-stat-value">
                                    {stats.totalTokens}
                                    {scanning && (
                                        <span style={{
                                            fontSize: '0.5em',
                                            color: 'var(--accent-cyan)',
                                            marginLeft: '8px',
                                            fontWeight: 400,
                                            opacity: 0.8,
                                        }}>
                                            <RefreshCw size={12} style={{
                                                display: 'inline',
                                                verticalAlign: 'middle',
                                                marginRight: '4px',
                                                animation: 'spin 1.5s linear infinite',
                                            }} />
                                            scanning...
                                        </span>
                                    )}
                                </div>
                                <div className="hero-stat-label">Tokens Launched</div>
                            </div>
                            <div>
                                <div className="hero-stat-value">
                                    {formatNumber(stats.totalReflected.toString())}
                                </div>
                                <div className="hero-stat-label">Total Reflected</div>
                            </div>
                            <div>
                                <div className="hero-stat-value">15K</div>
                                <div className="hero-stat-label">Sats per Launch</div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="page-container">
                    <div className="reveal" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px' }}>
                            Why <span style={{ color: 'var(--accent-purple-light)' }}>reflect.fi</span>?
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                            The first reflection token launchpad on Bitcoin, powered by OPNet smart contracts.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card reveal">
                            <div className="feature-icon">
                                <div className="icon-box purple">
                                    <Shield size={24} />
                                </div>
                            </div>
                            <h3 className="feature-title">Bitcoin L1 Security</h3>
                            <p className="feature-description">
                                Your tokens live on Bitcoin Layer 1 through OPNet's WASM runtime.
                                No bridges, no sidechains — pure Bitcoin security.
                            </p>
                        </div>

                        <div className="feature-card reveal">
                            <div className="feature-icon">
                                <div className="icon-box cyan">
                                    <RefreshCw size={24} />
                                </div>
                            </div>
                            <h3 className="feature-title">Automatic Reflections</h3>
                            <p className="feature-description">
                                Every transfer taxes a configurable percentage and instantly distributes
                                it to all holders. No staking or claiming required.
                            </p>
                        </div>

                        <div className="feature-card reveal">
                            <div className="feature-icon">
                                <div className="icon-box green">
                                    <Target size={24} />
                                </div>
                            </div>
                            <h3 className="feature-title">Custom Tax Rates</h3>
                            <p className="feature-description">
                                Set your reflection tax from 0% to 25%. Fine-tune the perfect balance
                                between transfer cost and holder rewards.
                            </p>
                        </div>

                        <div className="feature-card reveal">
                            <div className="feature-icon">
                                <div className="icon-box orange">
                                    <Rocket size={24} />
                                </div>
                            </div>
                            <h3 className="feature-title">One-Click Deploy</h3>
                            <p className="feature-description">
                                Launch your token in seconds. Just name it, set the tax, pay 15,000 sats,
                                and your reflection token is live on Bitcoin.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Tokens */}
            {recentTokens.length > 0 && (
                <section className="reveal" style={{ padding: '0 0 80px' }}>
                    <div className="page-container">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Recently Launched</h2>
                            <Link to="/explore" className="btn btn-outline btn-sm">
                                View All &rarr;
                            </Link>
                        </div>
                        <div className="token-grid">
                            {recentTokens.map((token) => (
                                <TokenCard key={token.contractAddress} token={token} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA */}
            <section className="reveal" style={{ padding: '60px 0 100px' }}>
                <div className="page-container" style={{ textAlign: 'center' }}>
                    <div className="card" style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        padding: '48px',
                        background: 'var(--gradient-card)',
                        borderColor: 'var(--border-accent)',
                    }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '12px' }}>
                            Ready to Launch?
                        </h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '28px', maxWidth: '400px', margin: '0 auto 28px' }}>
                            Create your reflection token on Bitcoin in under a minute.
                            Your holders will thank you.
                        </p>
                        <Link to="/launch" className="btn btn-primary btn-lg">
                            Launch Now — 15,000 sats
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
