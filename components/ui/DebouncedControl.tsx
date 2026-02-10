
import React, { useState, useEffect, useRef } from 'react';

interface DebouncedSliderProps {
  value: number;
  onChange: (val: number) => void;
  onInput?: (val: number) => void; // NEW: Real-time feedback
  min: number;
  max: number;
  step?: number;
  className?: string;
}

export const DebouncedSlider: React.FC<DebouncedSliderProps> = ({ value, onChange, onInput, min, max, step = 1, className = '' }) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync external changes (e.g. reset)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLocalValue(val);
    if (onInput) onInput(val); // Trigger immediate visual feedback
  };

  // Only commit change on mouse up (drag end) to prevent engine spam
  const handleCommit = () => {
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={localValue}
      onChange={handleChange}
      onMouseUp={handleCommit}
      onTouchEnd={handleCommit}
      className={className}
    />
  );
};

interface DebouncedInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string | number;
  onChange: (val: string) => void;
  delay?: number;
}

export const DebouncedInput: React.FC<DebouncedInputProps> = ({ value, onChange, delay = 500, ...props }) => {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = window.setTimeout(() => {
      onChange(e.target.value);
    }, delay);
  };

  return <input {...props} value={localValue} onChange={handleChange} />;
};
