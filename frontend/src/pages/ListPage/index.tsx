import React, { useEffect, useState } from "react";
import usePagination from "../../hooks/usePagination";
import { EActionMenuType, ESortType, ESpriteType } from "../../lib/types";
import { useActionMenuContext } from "../../contexts/ActionMenuContext";
import { useDataContext } from "../../contexts/DataContext";
import SpriteGroups from "./SpriteGroups";
import { ExportMod } from "../../../wailsjs/go/main/App";
import { toSorted } from "../../lib/utils";
import { makeCompareFunc, monsterNameFromId } from "./sorting";
import { main } from "../../../wailsjs/go/models";
import { isMonsterGroup, TGroupMonstersData, toGroupMonstersData } from "./grouping";
import GroupMonstersData from "./GroupMonstersData";
import SpriteGroupData from "./SpriteGroupData";
import { faPeopleGroup, faPerson, faUser, faUsers, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CARDS_PER_PAGE = 16;

enum EViewType {
    default = "default",
    groupMonsters = "groupMonsters",
}

export default function ListPage() {
    const { actionMenu, setActionMenu } = useActionMenuContext();
    const { refreshAndFetchSpriteGroupData, spriteGroupData } = useDataContext();

    useEffect(() => {
        if (actionMenu === null) refreshAndFetchSpriteGroupData();
    }, [actionMenu]);

    const [spriteType, setSpriteType] = useState<ESpriteType>(ESpriteType.battlesprites);
    const [query, setQuery] = useState("");
    const [sortType, setSortType] = useState<ESortType>(ESortType.idDesc);
    const [viewType, setViewType] = useState<EViewType>(EViewType.default);

    let spriteGroups = spriteGroupData?.data[spriteType] ?? [];
    const groupMonstersData = spriteGroupData ? toGroupMonstersData(spriteGroupData) : null;
    if (viewType === EViewType.groupMonsters && groupMonstersData) {
        if (isMonsterGroup(spriteType)) {
            spriteGroups = structuredClone(groupMonstersData.monsters);
        }
    }

    const filteredSpriteGroups = spriteGroups.filter(
        spriteGroup => spriteType && query
            ? monsterNameFromId(spriteGroup.id, spriteType).toLowerCase().includes(query.toLowerCase())
            : true
    );
    const sortedSpriteGroups = toSorted(filteredSpriteGroups, makeCompareFunc(sortType, spriteType));

    const {
        Pagination,
        itemsOnCurrentPage,
        setCurrentPage
    } = usePagination(sortedSpriteGroups, CARDS_PER_PAGE);

    function handleDefaultClick(_spriteType: ESpriteType) {
        setSpriteType(_spriteType);
        setCurrentPage(1);
    }

    function handleMonsterGroupClick(key: keyof TGroupMonstersData) {
        if (key in ESpriteType) {
            setSpriteType(key as ESpriteType);
        } else {
            setSpriteType(ESpriteType.battlesprites);
        }
    }

    function handleExport() {
        ExportMod();
    }

    return (
        <>
            <div className="flex justify-center items-center gap-4 h-[50px] w-full bg-purple-200">
                <div className="flex justify-center items-center m-2 rounded-md border border-black overflow-hidden">
                    {Object.keys(EViewType).map(_viewType => (
                        <div
                            key={_viewType}
                            className={(_viewType === viewType ? "bg-blue-200" : "")
                                + " h-full w-full p-2 border border-black cursor-pointer"}
                            onClick={() => setViewType(_viewType as EViewType)}
                        >
                            <FontAwesomeIcon icon={viewTypeToIcon(_viewType as EViewType)} />
                        </div>
                    ))}
                </div>
                {viewType === EViewType.groupMonsters
                    ? <GroupMonstersData
                        groupMonstersData={groupMonstersData}
                        spriteType={spriteType}
                        onClick={key => handleMonsterGroupClick(key as keyof TGroupMonstersData)}
                    />
                    : <SpriteGroupData
                        spriteGroupData={spriteGroupData}
                        spriteType={spriteType}
                        onClick={_spriteType => handleDefaultClick(_spriteType as ESpriteType)}
                    />
                }
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
            {spriteGroupData?.data &&
                <SpriteGroups
                    spriteGroups={itemsOnCurrentPage}
                    onClick={spriteGroup => setActionMenu({
                        type: EActionMenuType.spritesMapEditor,
                        sprites: spriteGroup.sprites,
                    })}
                />
            }
            <Pagination />
        </>
    )
}

function viewTypeToIcon(viewType: EViewType): IconDefinition {
    return viewTypeIconsRecord[viewType];
}

const viewTypeIconsRecord: Record<EViewType, IconDefinition> = {
    [EViewType.default]: faUser,
    [EViewType.groupMonsters]: faUsers,
};
