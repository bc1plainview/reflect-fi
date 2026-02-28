import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/launchpad/HomePage';
import { LaunchPage } from './components/launchpad/LaunchPage';
import { ExplorePage } from './components/explore/ExplorePage';
import { TokenDashboard } from './components/token/TokenDashboard';

function useScrollReveal(): void {
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
        );

        function observe(): void {
            const elements = document.querySelectorAll('.reveal:not(.revealed)');
            elements.forEach((el) => observer.observe(el));
        }

        observe();

        const mutationObserver = new MutationObserver(() => observe());
        mutationObserver.observe(document.body, { childList: true, subtree: true });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
        };
    }, []);
}

export function App(): ReactNode {
    useScrollReveal();

    return (
        <>
            <div className="grid-overlay" />
            <Navbar />
            <main style={{ flex: 1 }}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/launch" element={<LaunchPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/token/:address" element={<TokenDashboard />} />
                </Routes>
            </main>
            <Footer />
        </>
    );
}
