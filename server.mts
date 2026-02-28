/**
 * Standalone deployment API server.
 * Runs alongside Vite dev server on port 3001.
 * Handles token deployment using the funded deployer wallet.
 * Frontend calls POST /deploy with token params.
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { networks, initEccLib, crypto } from '@btc-vision/bitcoin';
import { TransactionFactory, BinaryWriter } from '@btc-vision/transaction';
import { ECPairSigner, createNobleBackend } from '@btc-vision/ecpair';
import { QuantumBIP32Factory } from '@btc-vision/bip32';
import { JSONRpcProvider } from 'opnet';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Deployer wallet — testnet only
const DEPLOYER_WIF = 'REMOVED_KEY_SEE_ENV';
const FEE_ADDRESS = 'opt1pcluu8yypmu3ylynk8vdxv44snyjmyff2f9j9vehggcfrunnmqkfq4phqrv';
const FEE_SATS = 15_000n;
const NETWORK = networks.opnetTestnet;
const RPC_URL = 'https://testnet.opnet.org';

let initialized = false;
let signer: ECPairSigner;
let mldsaKeypair: any;
let deployerAddress: string;
let provider: JSONRpcProvider;

async function init() {
    if (initialized) return;

    const backend = createNobleBackend();
    initEccLib(backend);

    signer = ECPairSigner.fromWIF(DEPLOYER_WIF, backend, NETWORK);
    deployerAddress = signer.taprootAddress;

    // ML-DSA keypair from seed
    const seedBuf = Buffer.alloc(64);
    const privKey = signer.privateKey;
    if (!privKey) throw new Error('No private key');
    privKey.copy(seedBuf, 0);
    privKey.copy(seedBuf, 32);
    const mldsaRoot = QuantumBIP32Factory.fromSeed(seedBuf, NETWORK, undefined, undefined, crypto);
    mldsaKeypair = mldsaRoot.derivePath("m/44'/0'/0'/0/0");

    provider = new JSONRpcProvider({ url: RPC_URL, network: NETWORK });

    initialized = true;
    console.log('[Deploy API] Initialized. Deployer:', deployerAddress);
}

interface DeployRequest {
    name: string;
    symbol: string;
    maxSupply: string;
    decimals: number;
    taxBasisPoints: number;
}

async function deployToken(params: DeployRequest) {
    await init();

    console.log('[Deploy API] Deploying:', params.name, '$' + params.symbol);

    const decimals = params.decimals;
    const maxSupply = BigInt(params.maxSupply) * (10n ** BigInt(decimals));

    // Build calldata
    const writer = new BinaryWriter();
    writer.writeU256(maxSupply);
    writer.writeU8(decimals);
    writer.writeStringWithLength(params.name);
    writer.writeStringWithLength(params.symbol);
    writer.writeU256(BigInt(params.taxBasisPoints));
    const calldata = writer.getBuffer();

    // Load WASM
    const wasmPath = path.join(__dirname, 'public', 'ReflectToken.wasm');
    const bytecode = new Uint8Array(fs.readFileSync(wasmPath));
    console.log('[Deploy API] WASM:', bytecode.length, 'bytes, Calldata:', calldata.length, 'bytes');

    // Fetch UTXOs
    const utxos = await provider.utxoManager.getUTXOs({
        address: deployerAddress,
        optimize: true,
    });
    if (!utxos || utxos.length === 0) {
        throw new Error('No UTXOs available. Deployer wallet needs testnet BTC.');
    }

    // Sort and limit UTXOs
    const sorted = [...utxos].sort((a, b) => {
        const va = BigInt(a.value);
        const vb = BigInt(b.value);
        return va > vb ? -1 : va < vb ? 1 : 0;
    });
    const limitedUtxos = sorted.slice(0, 5);
    console.log('[Deploy API] Using', limitedUtxos.length, 'UTXOs');

    // Get challenge
    const challenge = await provider.getChallenge();
    console.log('[Deploy API] Challenge obtained');

    // Deploy
    const factory = new TransactionFactory();
    const deployment = await factory.signDeployment({
        signer,
        mldsaSigner: mldsaKeypair,
        network: NETWORK,
        utxos: limitedUtxos,
        from: deployerAddress,
        feeRate: 10,
        priorityFee: 546n,
        gasSatFee: 500n,
        bytecode,
        calldata,
        challenge,
        optionalOutputs: [{
            address: FEE_ADDRESS,
            value: FEE_SATS,
        }],
    });

    console.log('[Deploy API] Contract address:', deployment.contractAddress);

    // Broadcast
    const [fundingTxHex, deployTxHex] = deployment.transaction;
    const fundResult = await provider.sendRawTransaction(fundingTxHex, false);
    console.log('[Deploy API] Funding tx:', fundResult.result, 'peers:', fundResult.peers);

    const deployResult = await provider.sendRawTransaction(deployTxHex, false);
    console.log('[Deploy API] Deploy tx:', deployResult.result, 'peers:', deployResult.peers);

    return {
        contractAddress: deployment.contractAddress,
        deployTxId: deployResult.result || '',
        fundingTxId: fundResult.result || '',
        deployer: deployerAddress,
    };
}

// HTTP Server
const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
    }

    if (req.method !== 'POST' || req.url !== '/deploy') {
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Not found' }));
        return;
    }

    let body = '';
    for await (const chunk of req) {
        body += chunk;
    }

    try {
        const params = JSON.parse(body) as DeployRequest;

        if (!params.name || !params.symbol || !params.maxSupply) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Missing required fields: name, symbol, maxSupply' }));
            return;
        }

        const result = await deployToken(params);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result));
    } catch (err) {
        console.error('[Deploy API] Error:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: (err as Error).message }));
    }
});

server.listen(3001, () => {
    console.log('[Deploy API] Running on http://localhost:3001');
    console.log('[Deploy API] POST /deploy with { name, symbol, maxSupply, decimals, taxBasisPoints }');
});
