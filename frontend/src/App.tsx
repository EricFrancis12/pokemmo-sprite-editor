import React, { useState, useEffect, useRef } from "react";
import { StritesTree } from "../wailsjs/go/main/App";
import importImage from "./imageLoader";
import { main } from "../wailsjs/go/models";
import usePagination from "./hooks/usePagination";

const CARDS_PER_PAGE = 10;

export default function App() {
    const [spritesDir, setSpritesDir] = useState<main.Dir | null>(null);
    const { Pagination, itemsOnCurrentPage } = usePagination(spritesDir?.dirs ?? [], CARDS_PER_PAGE);

    useEffect(() => {
        StritesTree().then(sd => {
            setSpritesDir(sd);
        });
    }, []);

    return (
        <div>
            {itemsOnCurrentPage
                .filter((_, index) => index === 0)
                .map((dir, index) => (
                    <div key={index} className="w-full my-4 bg-blue-200">
                        <Dir dir={dir} />
                    </div>
                ))}
            <Pagination />
        </div>
    );
}

const DIRS_PER_PAGE = 20;

function Dir({ dir }: {
    dir: main.Dir;
}) {
    const { Pagination, itemsOnCurrentPage } = usePagination(dir.files, DIRS_PER_PAGE);

    return (
        <>
            <div className="grid grid-cols-4 w-full">
                {itemsOnCurrentPage.map((file, index) => (
                    <div key={index} className="m-2 bg-green-200">
                        <DynamicImage path={file.path} />
                    </div>
                ))}
            </div>
            <Pagination />
        </>
    )
}

function DynamicImage({ path }: {
    path: string;
}) {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        const loadImage = async () => {
            const url = await importImage(formatFileAbsPath(path));
            setImageUrl(url);
        };

        loadImage();
    }, [path]);

    if (!imageUrl) {
        return (
            <div>Loading image...</div>
        )
    }

    return (
        <img
            src={imageUrl}
            alt={path}
        />
    )
}


function formatFileAbsPath(absPath: string): string {
    if (absPath.substring(0, 2) === "C:") {
        return absPath.substring(2).replaceAll("\\", "/");
    }
    return absPath;
}
