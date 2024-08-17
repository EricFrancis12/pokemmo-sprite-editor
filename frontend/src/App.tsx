import React, { useState, useEffect } from "react";
import { SpritesTree, SpritePath } from "../wailsjs/go/main/App";
import { importImage } from "./lib/utils";
import { main } from "../wailsjs/go/models";
import usePagination from "./hooks/usePagination";

const CARDS_PER_PAGE = 16;

export default function App() {
    const [spritesTree, setSpritesTree] = useState<main.Tree | null>(null);

    const [dirName, setDirName] = useState<string | null>(null);
    const { Pagination, itemsOnCurrentPage } = usePagination(
        dirName ? spritesTree?.children[dirName]?.sprites ?? [] : [],
        CARDS_PER_PAGE
    );

    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        SpritesTree().then(tree => {
            console.log(tree);
            setSpritesTree(tree);
            setDirName(Object.keys(tree.children)[0] ?? null);
        });
    }, []);

    return (
        <>
            <div className="flex justify-center items-center gap-4 h-[50px] w-full bg-purple-200">
                {spritesTree && Object.keys(spritesTree.children).map((_dirName, index) => (
                    <div
                        key={index}
                        className={(_dirName === dirName ? "bg-purple-300" : "bg-white") + " p-2 rounded cursor-pointer"}
                        onClick={() => setDirName(_dirName)}
                    >
                        {_dirName}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-4 w-full">
                {itemsOnCurrentPage
                    // TODO:
                    // .filter(sprite => searchQuery && sprite.name.includes(searchQuery))
                    .map((sprite, index) => (
                        <div key={index} className="w-full my-4 bg-blue-200">
                            <div className="m-2 bg-green-200">
                                <DynamicSprite sprite={sprite} />
                            </div>
                        </div>
                    ))}
            </div>
            <Pagination />
        </>
    );
}

function DynamicSprite({ sprite }: {
    sprite: main.Sprite;
}) {
    const [path, setPath] = useState(sprite.origPath);

    useEffect(() => {
        SpritePath(sprite).then(setPath);
    }, [sprite]);

    return (
        <DynamicImage path={path} />
    )
}

function DynamicImage({ path }: {
    path: string;
}) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        importImage(formatFileAbsPath(path)).then(setImageUrl);
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
