import React, { useEffect, useState } from "react";
import usePagination from "../../hooks/usePagination";
import { EActionMenuType, ESortType, ESpriteType } from "../../lib/types";
import { useActionMenuContext } from "../../contexts/ActionMenuContext";
import { useDataContext } from "../../contexts/DataContext";
import SpriteGroups from "./SpriteGroups";
import { ExportMod } from "../../../wailsjs/go/main/App";
import { formatErr, toSorted, uppercaseFirstLetter } from "../../lib/utils";
import { makeCompareFunc, monsterNameFromId } from "./sorting";
import { main } from "../../../wailsjs/go/models";
import { isMonsterGroup, TGroupMonstersData, toGroupMonstersData } from "./grouping";
import GroupMonstersData from "./GroupMonstersData";
import SpriteGroupData from "./SpriteGroupData";
import { faUser, faUsers, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { monstersDict } from "../../lib/constants";
import toast from "react-hot-toast";
import DefaultLayout from "../../layouts/DefaultLayout";

const CARDS_PER_PAGE = 16;

enum EViewType {
    default = "default",
    groupMonsters = "groupMonsters",
}

export default function ListPage() {
    const { actionMenu, setActionMenu } = useActionMenuContext();
    const { refreshAndFetchSpriteGroupData, spriteGroupData, loadingData } = useDataContext();

    useEffect(() => {
        if (actionMenu === null) refreshAndFetchSpriteGroupData();
    }, [actionMenu]);

    const [spriteType, setSpriteType] = useState<ESpriteType>(ESpriteType.battlesprites);
    const [query, setQuery] = useState("");
    const [sortType, setSortType] = useState<ESortType>(ESortType.idDesc);
    const [viewType, setViewType] = useState<EViewType>(EViewType.default);
    const [loading, setLoading] = useState(false);

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
        itemsOnCurrentPage: spriteGroupsOnCurrentPage,
        setCurrentPage,
        Pagination,
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

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        setQuery(e.target.value);
        setCurrentPage(1);
    }

    function handleExport() {
        if (loading) return;
        setLoading(true);
        ExportMod()
            .then(() => toast.success("Mod exported successfully"))
            .catch(err => toast.error(formatErr(err).message))
            .finally(() => setLoading(false));
    }

    return (
        <DefaultLayout>
            <div className="flex justify-between items-center gap-4 h-[50px] w-full px-4 bg-purple-200">
                <div className="flex items-center gap-4 h-full w-full">
                    <div className="flex justify-center items-center rounded-md border border-black overflow-hidden">
                        {Object.keys(EViewType).map(_viewType => (
                            <div
                                key={_viewType}
                                className={(_viewType === viewType ? "bg-blue-200" : "hover:opacity-70")
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
                </div>
                <div className="flex justify-end items-center gap-4 h-full w-full">
                    <input
                        placeholder="Search"
                        className="px-2 py-1 rounded"
                        value={query}
                        onChange={handleInputChange}
                    />
                    <select
                        className="px-2 py-1 rounded"
                        value={sortType}
                        onChange={e => setSortType(e.target.value as ESortType)}
                    >
                        {Object.values(ESortType).map((_sortType, index) => (
                            <option key={index} value={_sortType}>
                                {sortTypeText(_sortType as ESortType)}
                            </option>
                        ))}
                    </select>
                    <button
                        className={(loading ? "opacity-50" : "hover:opacity-70") + " px-3 py-2 bg-orange-300 rounded"}
                        disabled={loading}
                        onClick={handleExport}
                    >
                        Export
                    </button>
                </div>
            </div>
            {loadingData
                ? <div className="text-center h-[50px] w-full py-2 text-white">Loading Sprites...</div>
                : spriteGroupData?.data
                    ? <SpriteGroups
                        spriteGroups={spriteGroupsOnCurrentPage}
                        onClick={spriteGroup => setActionMenu({
                            title: actionMenuTitle(spriteGroup, spriteType, viewType),
                            type: EActionMenuType.spritesMapEditor,
                            sprites: spriteGroup.sprites,
                        })}
                    />
                    : ""
            }
            <div className="flex justify-center items-center mx-4 mt-2 px-4 py-2 border border-slate-400 rounded-lg">
                <Pagination className="text-slate-400" />
            </div>
        </DefaultLayout>
    )
}

function actionMenuTitle(spriteGroup: main.SpriteGroup, spriteType: ESpriteType, viewType: EViewType): string {
    let title = "";

    if (spriteType === ESpriteType.itemicons) {
        title += "Item " + spriteGroup.id;
    } else {
        title += monstersDict[spriteGroup.id];
    }

    if (viewType === EViewType.groupMonsters) {
        title += " Sprites";
    } else {
        title += " " + uppercaseFirstLetter(spriteType);
    }

    return title;
}

function viewTypeToIcon(viewType: EViewType): IconDefinition {
    return viewTypeIconsRecord[viewType];
}

const viewTypeIconsRecord: Record<EViewType, IconDefinition> = {
    [EViewType.default]: faUser,
    [EViewType.groupMonsters]: faUsers,
};

function sortTypeText(sortType: ESortType): string {
    return sortTypeTextRecord[sortType];
}

const sortTypeTextRecord: Record<ESortType, string> = {
    [ESortType.nameAsc]: "Name Asc",
    [ESortType.nameDesc]: "Name Desc",
    [ESortType.idAsc]: "ID Asc",
    [ESortType.idDesc]: "ID Desc",
};
