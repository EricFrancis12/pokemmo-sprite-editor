import React, { useState, useEffect } from "react";
import { SpritesTree, SpritePath } from "../../wailsjs/go/main/App";
import {
    importImage, makeSortTypeFunc, nameFromId,
    spriteFacing, spriteFrame, spriteGender, spriteIsShiny
} from "../lib/utils";
import { main } from "../../wailsjs/go/models";
import usePagination from "../hooks/usePagination";
import { EActionMenuType, ESortType, ESpriteType } from "../lib/types";
import { ActionMenuProvider, useActionMenuContext } from "../contexts/ActionMenuContext";

const CARDS_PER_PAGE = 8;

export default function ListPage() {
    const [spritesTree, setSpritesTree] = useState<main.Tree | null>(null);

    const [spriteType, setSpriteType] = useState<ESpriteType>(ESpriteType.battlesprites);
    const [query, setQuery] = useState("");
    const [sortType, setSortType] = useState<ESortType>(ESortType.idDesc);

    const ids = spriteType
        ? Object.keys(spritesTree?.children[spriteType]?.spritesMap ?? {})
            .filter(id => spriteType && query
                ? nameFromId(id, spriteType).toLowerCase().includes(query.toLowerCase())
                : true
            ) ?? []
        : [];

    const { Pagination, itemsOnCurrentPage, setCurrentPage } = usePagination(
        ids.sort(makeSortTypeFunc(sortType, spriteType)),
        CARDS_PER_PAGE
    );

    useEffect(() => {
        SpritesTree().then(tree => {
            setSpritesTree(tree);
            setSpriteType(Object.keys(tree.children)[0] as ESpriteType ?? null);
        });
    }, []);

    function handleClick(_spriteType: ESpriteType) {
        setSpriteType(_spriteType);
        setCurrentPage(1);
    }

    return (
        <ActionMenuProvider>
            <div className="flex justify-center items-center gap-4 h-[50px] w-full bg-purple-200">
                {spritesTree && Object.keys(spritesTree.children).map((_spriteType, index) => (
                    <div
                        key={index}
                        className={(_spriteType === spriteType ? "bg-purple-300" : "bg-white") + " p-2 rounded cursor-pointer"}
                        onClick={() => handleClick(_spriteType as ESpriteType)}
                    >
                        {_spriteType}
                    </div>
                ))}
                <input
                    placeholder="Search"
                    className="px-2 py-1 rounded"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <select
                    className="px-2 py-1 rounded"
                    value={sortType}
                    onChange={e => setSortType(e.target.value as ESortType)}
                >
                    {Object.values(ESortType).map((_sortType, index) => (
                        <option key={index}>
                            {_sortType}
                        </option>
                    ))}
                </select>
            </div>
            {spritesTree &&
                <Sprites
                    ids={itemsOnCurrentPage}
                    spriteType={spriteType}
                    spritesTree={spritesTree}
                />
            }
            <Pagination />
        </ActionMenuProvider>
    )
}

function Sprites({ ids, spriteType, spritesTree }: {
    ids: string[];
    spriteType: ESpriteType;
    spritesTree: main.Tree
}) {
    const { setActionMenu } = useActionMenuContext();

    return (
        <div className="grid grid-cols-4 w-full">
            {ids.map((id, index) => {
                const sprites = spriteType ? (spritesTree?.children[spriteType]?.spritesMap[id] ?? []) : [];
                return (
                    <div
                        key={index}
                        className="my-4 bg-blue-200"
                    >
                        <div
                            className="m-2 bg-green-200 cursor-pointer"
                            onClick={() => setActionMenu({
                                type: EActionMenuType.spritesMapEditor,
                                sprites,
                            })}
                        >
                            {sprites.map((sprite, _index) => {
                                return _index === sprites.length - 1
                                    ? <DynamicSprite key={_index} sprite={sprite} />
                                    : null
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export function DynamicSprite({ sprite }: {
    sprite: main.Sprite;
}) {
    const [path, setPath] = useState(sprite.origPath);

    useEffect(() => {
        SpritePath(sprite).then(setPath);
    }, [sprite]);

    return (
        <div>
            <DynamicImage path={path} />
            {/* <div>Gender: {spriteGender(sprite)}</div>
            <div>Shiny: {`${spriteIsShiny(sprite)}`}</div>
            <div>Facing: {spriteFacing(sprite)}</div>
            <div>Frame: {`${spriteFrame(sprite)}`}</div> */}
        </div>
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
