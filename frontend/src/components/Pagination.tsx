import React from "react";

export type TPagination = "<<" | "<" | number | "..." | ">" | ">>";

export default function Pagination({ pagination, currentPage, className = "", onClick = () => { } }: {
    pagination: TPagination[];
    currentPage?: number;
    className?: string;
    onClick?: (pgn: TPagination) => void;
}) {
    return (
        <div className={"flex justify-around w-full " + className}>
            {pagination.map((pgn, index) => (
                <span
                    key={index}
                    className={(pgn !== "..." ? "cursor-pointer hover:underline " : " ")
                        + (pgn === currentPage ? " text-blue-500 font-bold" : " ")}
                    onClick={() => onClick(pgn)}
                >
                    {pgn}
                </span>
            ))}
        </div>
    )
}

export function generatePagination({ currentPage, totalPages }: {
    currentPage: number,
    totalPages: number
}): TPagination[] {
    let result: TPagination[] = [
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        totalPages
    ];

    if (totalPages <= 7) {
        result = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else if (currentPage <= 3) {
        result = [1, 2, 3, "...", totalPages - 1, totalPages];
    } else if (currentPage >= totalPages - 2) {
        result = [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    }

    return [
        "<<",
        "<",
        ...result,
        ">",
        ">>"
    ];
}
