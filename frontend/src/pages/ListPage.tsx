import React, { useState, useEffect, useRef } from "react";
import { ExportMod } from "../../wailsjs/go/main/App";
import { importImage, makeSortTypeFunc, nameFromId } from "../lib/utils";
import { main } from "../../wailsjs/go/models";
import usePagination from "../hooks/usePagination";
import { EActionMenuType, ESortType, ESpriteType } from "../lib/types";
import { ActionMenuProvider, useActionMenuContext } from "../contexts/ActionMenuContext";
import { useDataContext } from "../contexts/DataContext";
import { SpriteWithColorData, toSpriteWithColorData } from "../components/ActionMenu/ActionMenuBody/SpritesMapEditorBody";

const CARDS_PER_PAGE = 8;

export default function ListPage() {
    const { spritesTree } = useDataContext();

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

    function handleClick(_spriteType: ESpriteType) {
        setSpriteType(_spriteType);
        setCurrentPage(1);
    }

    function handleExport() {
        ExportMod();
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
                <button
                    className="px-3 py-2 bg-orange-300 rounded"
                    onClick={handleExport}
                >
                    Export
                </button>
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
                    <div key={index} className="my-4 bg-blue-200">
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
    // const [path, setPath] = useState(sprite.url);
    const path = useRef(sprite.url)

    fetch(sprite.url)
        .then(res => res.blob())
        .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            // setPath(blobUrl);
            path.current = blobUrl;
        });

    return (
        <img src={path.current} alt={path.current} />
    )
}
