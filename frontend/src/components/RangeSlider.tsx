import React from "react";

export default function RangeSlider({ value, onChange, min, max, step, className, style }: {
    value: number;
    onChange: (n: number) => void;
    min: number;
    max: number;
    step: number;
    className?: string;
    style?: React.CSSProperties;
}) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const n = parseFloat(e.target.value);
        if (!isNaN(n)) onChange(n);
    }

    return (
        <input
            type="range"
            className={className} style={style}
            step={step}
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
        />
    )
}
