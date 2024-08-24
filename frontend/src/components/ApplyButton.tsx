import React from "react";

export default function ApplyButton({ onClick, disabled }: {
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            className="px-2 py-1 rounded bg-green-300"
            disabled={disabled}
            onClick={onClick}
        >
            <span className={disabled ? "opacity-50" : ""}>Apply</span>
        </button>
    )
}
