import React, { useState } from "react";
import { ExportMod } from "../../../wailsjs/go/main/App";
import { makeSortTypeFunc, nameFromId, toSorted } from "../../lib/utils";
import usePagination from "../../hooks/usePagination";
import { ESortType, ESpriteType } from "../../lib/types";
import { ActionMenuProvider } from "../../contexts/ActionMenuContext";
import { useDataContext } from "../../contexts/DataContext";
import Sprites from "./Sprites";

const CARDS_PER_PAGE = 16;

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
        toSorted(ids, makeSortTypeFunc(sortType, spriteType)),
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
