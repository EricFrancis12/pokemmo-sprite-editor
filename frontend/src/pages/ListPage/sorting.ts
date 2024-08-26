import { itemsDict, monstersDict } from "../../lib/constants";
import { main } from "../../../wailsjs/go/models";
import { ESortType, ESpriteType } from "../../lib/types";

type SortTypeFunc = (a: main.SpriteGroup, b: main.SpriteGroup) => number;

export function makeCompareFunc(sortType: ESortType, spriteType: ESpriteType): SortTypeFunc {
    switch (sortType) {
        case ESortType.nameAsc:
            return (a: main.SpriteGroup, b: main.SpriteGroup) => monsterNameFromId(a.id, spriteType) > monsterNameFromId(b.id, spriteType) ? -1 : 1;
        case ESortType.nameDesc:
            return (a: main.SpriteGroup, b: main.SpriteGroup) => monsterNameFromId(a.id, spriteType) > monsterNameFromId(b.id, spriteType) ? 1 : -1;
        case ESortType.idAsc:
            return (a: main.SpriteGroup, b: main.SpriteGroup) => parseInt(a.id) > parseInt(b.id) ? -1 : 1;
        case ESortType.idDesc:
            return (a: main.SpriteGroup, b: main.SpriteGroup) => parseInt(a.id) > parseInt(b.id) ? 1 : -1;
    }
}

export function monsterNameFromId(id: string, spriteType: ESpriteType): string {
    return spriteTypesRecord[spriteType](id);
}

type SpriteTypeMatcherFunc = (id: string) => string;

const spriteTypesRecord: Record<ESpriteType, SpriteTypeMatcherFunc> = {
    [ESpriteType.battlesprites]: battlespritesMatcher,
    [ESpriteType.followsprites]: followspritesMatcher,
    [ESpriteType.itemicons]: itemiconsMatcher,
    [ESpriteType.monstericons]: monstericonsMatcher,
};

function battlespritesMatcher(id: string): string {
    return monstersDict[id] ?? "";
}

function followspritesMatcher(id: string): string {
    return monstersDict[id] ?? "";
}

function itemiconsMatcher(id: string): string {
    return itemsDict[id] ?? "";
}

function monstericonsMatcher(id: string): string {
    return monstersDict[id] ?? "";
}
