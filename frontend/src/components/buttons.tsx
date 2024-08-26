import React from "react";

export function BaseButton({ title, onClick, disabled, className = "" }: {
    title: string;
    onClick: () => void;
    disabled?: boolean;
    className?: string;
}) {
    return (
        <button
            className={"px-2 py-2 rounded hover:opacity-70 " + className}
            disabled={disabled}
            onClick={onClick}
        >
            <span className={disabled ? "opacity-50" : ""}>{title}</span>
        </button>
    )
}

export function ApplyButton({ onClick, disabled }: {
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <BaseButton
            title="Apply"
            onClick={onClick}
            disabled={disabled}
            className="bg-green-300"
        />
    )
}

export function RevertButton({ onClick, disabled }: {
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <BaseButton
            title="Revert Changes"
            onClick={onClick}
            disabled={disabled}
            className="bg-purple-300"
        />
    )
}
