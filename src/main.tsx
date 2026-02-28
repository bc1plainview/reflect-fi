import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { WalletConnectProvider } from '@btc-vision/walletconnect';
import { App } from './App';
import './styles/index.css';

const root = document.getElementById('root');
if (root) {
    ReactDOM.createRoot(root).render(
        <React.StrictMode>
            <WalletConnectProvider theme="dark">
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </WalletConnectProvider>
        </React.StrictMode>,
    );
}
