/**
 * Browser signer for OP_WALLET (window.opnet).
 *
 * OPWallet extends the Unisat interface, so window.opnet exposes
 * signPsbt(), getPublicKey(), getNetwork() etc.  UnisatSigner already
 * implements the full PSBT-signing flow; we just redirect it from
 * window.unisat to window.opnet.
 *
 * This avoids the broken web3.deployContract() path where Uint8Array
 * gets destroyed by Chrome extension IPC serialization.
 *
 * We do NOT override the network — OP_WALLET internally operates on
 * regtest (bcrt1p addresses) even though OPNet testnet uses opt1p for
 * display. The PSBT signing must use regtest parameters to match the
 * wallet's key validation.
 */
import { UnisatSigner, type Unisat } from '@btc-vision/transaction';

export class OPNetBrowserSigner extends UnisatSigner {
    /**
     * Override to read from window.opnet instead of window.unisat.
     * Since OPWallet extends Unisat, all required methods are present.
     */
    public override get unisat(): Unisat {
        if (typeof window === 'undefined') {
            throw new Error('OPNetBrowserSigner can only be used in a browser');
        }

        const opnet = (window as unknown as Record<string, unknown>).opnet as Unisat | undefined;
        if (!opnet) {
            throw new Error(
                'OP_WALLET extension not found. Install it from the Chrome Web Store.',
            );
        }

        return opnet;
    }
}
