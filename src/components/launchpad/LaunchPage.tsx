import { useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletConnect } from '@btc-vision/walletconnect';
import { BinaryWriter, TransactionFactory } from '@btc-vision/transaction';
import type { IDeploymentParameters } from '@btc-vision/transaction';
import { toSatoshi } from '@btc-vision/bitcoin';
import { Check, ExternalLink } from 'lucide-react';
import { LAUNCHPAD_FEE_SATS, LAUNCHPAD_FEE_ADDRESS } from '../../config';
import { tokenRegistryService } from '../../services/TokenRegistryService';
import { formatSats, formatBasisPoints } from '../../utils/formatting';
import type { LaunchedToken } from '../../config/contracts';

interface FormState {
    name: string;
    symbol: string;
    maxSupply: string;
    decimals: string;
    taxBasisPoints: number;
}

type Step = 'form' | 'confirm' | 'success';

function StepIndicator({ current }: { current: Step }): ReactNode {
    const steps: { key: Step; label: string; num: number }[] = [
        { key: 'form', label: 'Configure', num: 1 },
        { key: 'confirm', label: 'Review & Deploy', num: 2 },
        { key: 'success', label: 'Complete', num: 3 },
    ];
    const currentIdx = steps.findIndex((s) => s.key === current);

    return (
        <div className="step-indicator">
            {steps.map((s, i) => (
                <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        className={`step-item ${
                            i < currentIdx ? 'completed' : i === currentIdx ? 'active' : ''
                        }`}
                    >
                        <div className="step-number">
                            {i < currentIdx ? (
                                <Check size={18} />
                            ) : (
                                s.num
                            )}
                        </div>
                        <span className="step-label">{s.label}</span>
                    </div>
                    {i < steps.length - 1 && (
                        <div
                            className={`step-connector ${i < currentIdx ? 'completed' : ''}`}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}

export function LaunchPage(): ReactNode {
    const navigate = useNavigate();
    const { walletAddress, provider, network, openConnectModal } = useWalletConnect();

    const [form, setForm] = useState<FormState>({
        name: '',
        symbol: '',
        maxSupply: '1000000',
        decimals: '8',
        taxBasisPoints: 100,
    });
    const [launching, setLaunching] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState<Step>('form');
    const [deployedAddress, setDeployedAddress] = useState('');
    const [txId, setTxId] = useState('');
    const [statusMsg, setStatusMsg] = useState('');

    const updateField = (field: keyof FormState, value: string | number): void => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setError('');
    };

    const validate = (): string | null => {
        if (!form.name.trim()) return 'Token name is required';
        if (form.name.length > 32) return 'Token name must be 32 characters or less';
        if (!form.symbol.trim()) return 'Token symbol is required';
        if (form.symbol.length > 10) return 'Symbol must be 10 characters or less';
        const supply = parseInt(form.maxSupply);
        if (isNaN(supply) || supply <= 0) return 'Max supply must be a positive number';
        const decimals = parseInt(form.decimals);
        if (isNaN(decimals) || decimals < 0 || decimals > 18) return 'Decimals must be 0-18';
        if (form.taxBasisPoints < 0 || form.taxBasisPoints > 2500) return 'Tax must be 0-25%';
        return null;
    };

    const handleSubmit = useCallback((): void => {
        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }
        if (!walletAddress) {
            openConnectModal();
            return;
        }
        setStep('confirm');
    }, [form, walletAddress, openConnectModal]);

    const handleConfirmLaunch = useCallback(async (): Promise<void> => {
        if (!walletAddress || !provider || !network) {
            setError('Wallet not connected. Please connect OP_WALLET first.');
            return;
        }

        setLaunching(true);
        setError('');

        try {
            /* ── Load contract bytecode ── */
            setStatusMsg('Loading contract bytecode...');
            const wasmResponse = await fetch('/ReflectToken.wasm');
            if (!wasmResponse.ok) {
                throw new Error(`Failed to load contract bytecode (${wasmResponse.status})`);
            }
            const wasmBytes = new Uint8Array(await wasmResponse.arrayBuffer());
            console.log('[ReflectFi] WASM loaded:', wasmBytes.length, 'bytes');

            /* ── Build constructor calldata ── */
            const decimals = parseInt(form.decimals);
            const maxSupply = BigInt(form.maxSupply) * (10n ** BigInt(decimals));
            const symbol = form.symbol.toUpperCase();

            const writer = new BinaryWriter();
            writer.writeU256(maxSupply);
            writer.writeU8(decimals);
            writer.writeStringWithLength(form.name);
            writer.writeStringWithLength(symbol);
            writer.writeU256(BigInt(form.taxBasisPoints));
            const calldata = writer.getBuffer();
            console.log('[ReflectFi] Calldata built:', calldata.length, 'bytes');

            /* ── Fetch UTXOs ── */
            setStatusMsg('Fetching wallet UTXOs...');
            const utxos = await provider.utxoManager.getUTXOs({
                address: walletAddress,
                optimize: true,
            });

            if (!utxos || utxos.length === 0) {
                throw new Error('No UTXOs available. Your wallet needs testnet BTC.');
            }

            const sorted = [...utxos].sort((a, b) => {
                const va = BigInt(a.value);
                const vb = BigInt(b.value);
                return va > vb ? -1 : va < vb ? 1 : 0;
            });
            const limitedUtxos = sorted.slice(0, 5);
            console.log('[ReflectFi] Using', limitedUtxos.length, 'of', utxos.length, 'UTXOs');

            /* ── Deploy via TransactionFactory (auto-detects OP_WALLET) ── */
            setStatusMsg('Waiting for OP_WALLET approval...');
            console.log('[ReflectFi] Calling TransactionFactory.signDeployment()...');

            const factory = new TransactionFactory();
            const result = await factory.signDeployment({
                network,
                bytecode: wasmBytes,
                calldata,
                utxos: limitedUtxos,
                from: walletAddress,
                feeRate: 10,
                priorityFee: 1000n,
                gasSatFee: 10_000n,
                optionalOutputs: [{
                    address: LAUNCHPAD_FEE_ADDRESS,
                    value: toSatoshi(LAUNCHPAD_FEE_SATS),
                }],
            } as unknown as IDeploymentParameters);

            const contractAddress = result.contractAddress;
            const [fundingTxHex, deployTxHex] = result.transaction;

            console.log('[ReflectFi] Contract address:', contractAddress);
            console.log('[ReflectFi] Funding tx hex length:', fundingTxHex.length);
            console.log('[ReflectFi] Deploy tx hex length:', deployTxHex.length);

            if (!fundingTxHex || fundingTxHex.length < 20) {
                throw new Error('Wallet returned empty funding transaction');
            }
            if (!deployTxHex || deployTxHex.length < 20) {
                throw new Error('Wallet returned empty deployment transaction');
            }

            /* ── Broadcast funding tx ── */
            setStatusMsg('Broadcasting funding transaction...');
            const fundResult = await provider.sendRawTransaction(fundingTxHex, false);
            console.log('[ReflectFi] Funding broadcast:', JSON.stringify(fundResult));

            if (!fundResult.success) {
                throw new Error(`Funding tx failed: ${fundResult.error ?? 'Unknown error'}`);
            }

            /* ── Wait for funding tx to reach mempool, then broadcast deploy tx ── */
            setStatusMsg('Broadcasting deployment transaction...');
            await new Promise<void>((resolve) => {
                setTimeout(resolve, 3000);
            });

            const deployResult = await provider.sendRawTransaction(deployTxHex, false);
            console.log('[ReflectFi] Deploy broadcast:', JSON.stringify(deployResult));

            if (!deployResult.success) {
                throw new Error(`Deploy tx failed: ${deployResult.error ?? 'Unknown error'}`);
            }

            const deployTxId = deployResult.result ?? '';

            /* ── Register token locally ── */
            const newToken: LaunchedToken = {
                contractAddress,
                name: form.name,
                symbol,
                decimals,
                maxSupply: form.maxSupply,
                taxBasisPoints: form.taxBasisPoints,
                deployer: walletAddress,
                deployedAt: Date.now(),
                totalReflected: '0',
                holders: 1,
                transfers: 0,
            };
            tokenRegistryService.register(newToken);

            setDeployedAddress(contractAddress);
            setTxId(deployTxId);
            setStatusMsg('');
            setStep('success');
        } catch (err) {
            console.error('[ReflectFi] Deploy error:', err);
            const message = err instanceof Error ? err.message : 'Deployment failed.';
            setError(message);
            setStatusMsg('');
        } finally {
            setLaunching(false);
        }
    }, [form, walletAddress, provider, network]);

    return (
        <div className="page-container">
            <div className="launch-section">
                <StepIndicator current={step} />

                {/* ── STEP 1: Configure Token ── */}
                {step === 'form' && (
                    <div className="launch-card">
                        <h2 className="launch-title">Configure Your Token</h2>
                        <p className="launch-subtitle">
                            Set up your OP20 reflection token parameters. Every transfer will
                            automatically redistribute the tax to all holders.
                        </p>

                        {!walletAddress && (
                            <div className="wallet-prompt">
                                <div className="wallet-prompt-icon" />
                                <div className="wallet-prompt-text">
                                    Connect your OP_WALLET to deploy
                                </div>
                                <button
                                    className="btn btn-primary"
                                    onClick={openConnectModal}
                                >
                                    Connect Wallet
                                </button>
                            </div>
                        )}

                        <div className="fee-banner">
                            <span className="fee-label">Deployment Fee</span>
                            <span className="fee-amount">{formatSats(LAUNCHPAD_FEE_SATS)}</span>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Token Name</label>
                            <input
                                className="form-input"
                                type="text"
                                placeholder="e.g. MoonReflect"
                                value={form.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                maxLength={32}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Token Symbol</label>
                            <input
                                className="form-input form-input-mono"
                                type="text"
                                placeholder="e.g. MREF"
                                value={form.symbol}
                                onChange={(e) =>
                                    updateField('symbol', e.target.value.toUpperCase())
                                }
                                maxLength={10}
                            />
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '16px',
                            }}
                        >
                            <div className="form-group">
                                <label className="form-label">Max Supply</label>
                                <input
                                    className="form-input form-input-mono"
                                    type="text"
                                    placeholder="1000000"
                                    value={form.maxSupply}
                                    onChange={(e) =>
                                        updateField(
                                            'maxSupply',
                                            e.target.value.replace(/[^0-9]/g, ''),
                                        )
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Decimals</label>
                                <input
                                    className="form-input form-input-mono"
                                    type="number"
                                    min={0}
                                    max={18}
                                    value={form.decimals}
                                    onChange={(e) => updateField('decimals', e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Reflection Tax Rate</label>
                            <div className="tax-slider-container">
                                <div className="tax-display">
                                    <span
                                        style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem',
                                        }}
                                    >
                                        Tax per transfer
                                    </span>
                                    <span className="tax-value">
                                        {formatBasisPoints(form.taxBasisPoints)}
                                    </span>
                                </div>
                                <input
                                    className="tax-slider"
                                    type="range"
                                    min={0}
                                    max={2500}
                                    step={25}
                                    value={form.taxBasisPoints}
                                    onChange={(e) =>
                                        updateField('taxBasisPoints', parseInt(e.target.value))
                                    }
                                />
                                <div className="tax-labels">
                                    <span>0%</span>
                                    <span>5%</span>
                                    <span>10%</span>
                                    <span>15%</span>
                                    <span>20%</span>
                                    <span>25%</span>
                                </div>
                            </div>
                            <div className="form-hint">
                                This percentage is deducted from every transfer and redistributed
                                to all token holders proportionally.
                            </div>
                        </div>

                        {error && <div className="error-banner">{error}</div>}

                        <button
                            className="btn btn-primary btn-lg"
                            style={{ width: '100%', fontSize: '1.1rem', padding: '18px 32px' }}
                            onClick={handleSubmit}
                        >
                            {walletAddress ? 'Review Token Details' : 'Connect Wallet to Continue'}
                        </button>
                    </div>
                )}

                {/* ── STEP 2: Review & Deploy ── */}
                {step === 'confirm' && (
                    <div className="launch-card">
                        {launching ? (
                            <div className="deploy-progress">
                                <div className="deploy-spinner" />
                                <div className="deploy-status">{statusMsg}</div>
                                <div className="deploy-substatus">
                                    OP_WALLET will prompt you to approve the transaction
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="launch-title">Review Your Token</h2>
                                <p className="launch-subtitle">
                                    Verify everything is correct. Deployment is permanent and
                                    cannot be undone.
                                </p>

                                <div className="review-grid">
                                    <div className="review-row">
                                        <span className="review-label">Token Name</span>
                                        <span className="review-value">{form.name}</span>
                                    </div>
                                    <div className="review-row">
                                        <span className="review-label">Symbol</span>
                                        <span className="review-value-mono">
                                            ${form.symbol.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="review-row">
                                        <span className="review-label">Max Supply</span>
                                        <span className="review-value-mono">
                                            {parseInt(form.maxSupply).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="review-row">
                                        <span className="review-label">Decimals</span>
                                        <span className="review-value">{form.decimals}</span>
                                    </div>
                                    <div className="review-row">
                                        <span className="review-label">Reflection Tax</span>
                                        <span className="tax-badge">
                                            {formatBasisPoints(form.taxBasisPoints)}
                                        </span>
                                    </div>
                                    <div className="review-row review-row-highlight">
                                        <span className="review-label">Deployment Fee</span>
                                        <span className="review-value-accent">
                                            {formatSats(LAUNCHPAD_FEE_SATS)}
                                        </span>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        fontSize: '0.78rem',
                                        color: 'var(--text-muted)',
                                        marginBottom: '24px',
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Fee recipient:{' '}
                                    <span
                                        style={{
                                            fontFamily: 'var(--font-mono)',
                                            fontSize: '0.72rem',
                                            wordBreak: 'break-all',
                                        }}
                                    >
                                        {LAUNCHPAD_FEE_ADDRESS}
                                    </span>
                                </div>

                                {error && <div className="error-banner">{error}</div>}

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button
                                        className="btn btn-secondary btn-lg"
                                        style={{ flex: 1 }}
                                        onClick={() => {
                                            setStep('form');
                                            setError('');
                                        }}
                                    >
                                        Back
                                    </button>
                                    <button
                                        className="btn btn-primary btn-lg"
                                        style={{
                                            flex: 2,
                                            fontSize: '1.1rem',
                                            padding: '18px 32px',
                                        }}
                                        onClick={() => void handleConfirmLaunch()}
                                    >
                                        Deploy Token on Bitcoin
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* ── STEP 3: Success ── */}
                {step === 'success' && (
                    <div className="launch-card" style={{ textAlign: 'center' }}>
                        <div className="success-checkmark">
                            <Check size={36} />
                        </div>

                        <h2
                            className="launch-title"
                            style={{ fontSize: '1.8rem', marginBottom: '12px' }}
                        >
                            Token Deployed
                        </h2>
                        <p className="launch-subtitle" style={{ marginBottom: '28px' }}>
                            <strong>{form.name}</strong> (${form.symbol.toUpperCase()}) is now
                            live on OPNet Testnet with{' '}
                            {formatBasisPoints(form.taxBasisPoints)} reflection tax.
                        </p>

                        <div className="contract-address-box">
                            <span className="contract-address-label">Contract Address</span>
                            {deployedAddress}
                        </div>

                        {txId && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                marginBottom: '16px',
                            }}>
                                <div style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--text-muted)',
                                }}>
                                    Transaction:{' '}
                                    <span style={{ fontFamily: 'var(--font-mono)' }}>
                                        {txId.slice(0, 12)}...{txId.slice(-8)}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    gap: '10px',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                }}>
                                    <a
                                        href={`https://mempool.opnet.org/testnet4/tx/${txId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline btn-sm"
                                        style={{ fontSize: '0.78rem', gap: '6px' }}
                                    >
                                        <ExternalLink size={13} />
                                        View on Mempool
                                    </a>
                                    <a
                                        href={`https://opscan.org/tx/${txId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline btn-sm"
                                        style={{ fontSize: '0.78rem', gap: '6px' }}
                                    >
                                        <ExternalLink size={13} />
                                        View on OPScan
                                    </a>
                                </div>
                            </div>
                        )}

                        <div
                            style={{
                                fontSize: '0.78rem',
                                color: 'var(--text-muted)',
                                marginBottom: '32px',
                                padding: '10px 16px',
                                background: 'rgba(16, 185, 129, 0.06)',
                                borderRadius: 'var(--radius-sm)',
                            }}
                        >
                            Waiting for the next block to confirm. This may take a few minutes on
                            testnet.
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'center',
                            }}
                        >
                            <button
                                className="btn btn-secondary btn-lg"
                                onClick={() => navigate(`/token/${deployedAddress}`)}
                            >
                                View Dashboard
                            </button>
                            <button
                                className="btn btn-primary btn-lg"
                                onClick={() => {
                                    setStep('form');
                                    setForm({
                                        name: '',
                                        symbol: '',
                                        maxSupply: '1000000',
                                        decimals: '8',
                                        taxBasisPoints: 100,
                                    });
                                    setError('');
                                    setDeployedAddress('');
                                    setTxId('');
                                }}
                            >
                                Launch Another Token
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
