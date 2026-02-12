
import React, { useState, useEffect } from 'react';

interface AnimatedCounterProps {
    value: number;
    className?: string;
    precision?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, className, precision = 0 }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        let start = displayValue;
        let end = value;
        if (start === end) return;

        const duration = 500;
        const startTime = performance.now();
        let animationFrameId: number;

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3); // Cubic ease out
            
            const current = start + (end - start) * ease;
            setDisplayValue(current);

            if (progress < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setDisplayValue(end);
            }
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [value]);

    const formatted = precision > 0 ? displayValue.toFixed(precision) : Math.ceil(displayValue).toString();
    
    return <span className={className}>{formatted}</span>;
};
