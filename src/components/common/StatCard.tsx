import { useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

interface StatCardProps {
    label: string;
    value: string;
    change?: string;
    positive?: boolean;
}

function useAnimatedNumber(target: string): string {
    const [display, setDisplay] = useState(target);
    const ref = useRef<HTMLDivElement>(null);
    const animated = useRef(false);

    useEffect(() => {
        if (animated.current) {
            setDisplay(target);
            return;
        }

        const num = parseFloat(target.replace(/[^0-9.]/g, ''));
        if (isNaN(num) || num === 0) {
            setDisplay(target);
            animated.current = true;
            return;
        }

        const suffix = target.replace(/[0-9.,\s]/g, '');
        const hasDecimal = target.includes('.');
        const decimalPlaces = hasDecimal ? (target.split('.')[1]?.replace(/[^0-9]/g, '').length ?? 0) : 0;

        const el = ref.current;
        if (!el) {
            setDisplay(target);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting && !animated.current) {
                    animated.current = true;
                    observer.disconnect();

                    const duration = 800;
                    const start = performance.now();

                    function tick(now: number): void {
                        const elapsed = now - start;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        const current = num * eased;

                        if (hasDecimal) {
                            setDisplay(current.toFixed(decimalPlaces) + suffix);
                        } else {
                            setDisplay(Math.round(current).toLocaleString() + suffix);
                        }

                        if (progress < 1) {
                            requestAnimationFrame(tick);
                        } else {
                            setDisplay(target);
                        }
                    }

                    requestAnimationFrame(tick);
                }
            },
            { threshold: 0.3 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [target]);

    return display;
}

export function StatCard({ label, value, change, positive }: StatCardProps): ReactNode {
    const animatedValue = useAnimatedNumber(value);
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="stat-card" ref={containerRef}>
            <div className="stat-label">{label}</div>
            <div className="stat-value">{animatedValue}</div>
            {change && (
                <div className={`stat-change ${positive ? 'positive' : 'negative'}`}>
                    {positive ? '+' : ''}{change}
                </div>
            )}
        </div>
    );
}
