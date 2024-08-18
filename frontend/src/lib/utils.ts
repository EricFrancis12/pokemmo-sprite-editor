import { main } from "../../wailsjs/go/models";
import { itemsDict, pokemonDict } from "./constants";
import { ESpriteType, EGender, EShiny, EFacing, ESortType } from "./types";

export async function importImage(path: string): Promise<string | null> {
    try {
        const image = await import(path);
        return typeof image?.default === "string" ? image.default : null;
    } catch (err) {
        return null;
    }
}

export function spriteGender(sprite: main.Sprite): EGender | null {
    const fileName = base(sprite.origPath);
    const [basename] = fileName.split(".");
    if (!basename) return null;

    const splitOnDash = basename.split("-");

    switch (sprite.spriteType) {
        case ESpriteType.battlesprites:
            const last = splitOnDash[splitOnDash.length - 1] ?? "";
            return (Object.values(EGender) as string[]).includes(last) ? last as EGender : EGender.both;
        case ESpriteType.followsprites:
            const second = splitOnDash[2] ?? "";
            return (Object.values(EGender) as string[]).includes(second) ? second as EGender : EGender.both;
        case ESpriteType.itemicons:
            return null;
        case ESpriteType.monstericons:
            return null;
        default:
            return null;
    }
}

export function spriteIsShiny(sprite: main.Sprite): boolean | null {
    const fileName = base(sprite.origPath);
    const [basename] = fileName.split(".");
    if (!basename) return null;

    const splitOnDash = basename.split("-");
    const third = splitOnDash[2] ?? "";

    switch (sprite.spriteType) {
        case ESpriteType.battlesprites:
            return (Object.values(EShiny) as string[]).includes(third) ? third === EShiny.shiny : false;
        case ESpriteType.followsprites:
            return (Object.values(EShiny) as string[]).includes(third) ? third === EShiny.shiny : false;
        case ESpriteType.itemicons:
            return null;
        case ESpriteType.monstericons:
            return null;
        default:
            return null;
    }
}

export function spriteFacing(sprite: main.Sprite): EFacing | null {
    const fileName = base(sprite.origPath);
    const [basename] = fileName.split(".");
    if (!basename) return null;

    const splitOnDash = basename.split("-");
    const second = splitOnDash[1] ?? "";

    switch (sprite.spriteType) {
        case ESpriteType.battlesprites:
            return (Object.values(EFacing) as string[]).includes(second) ? second as EFacing : null;
        case ESpriteType.followsprites:
            return null;
        case ESpriteType.itemicons:
            return null;
        case ESpriteType.monstericons:
            return null;
        default:
            return null;
    }
}

export function spriteFrame(sprite: main.Sprite): number | null {
    const fileName = base(sprite.origPath);
    const [basename] = fileName.split(".");
    if (!basename) return null;

    const splitOnDash = basename.split("-");
    const second = splitOnDash[1] ?? "";

    switch (sprite.spriteType) {
        case ESpriteType.battlesprites:
            return null;
        case ESpriteType.followsprites:
            return null;
        case ESpriteType.itemicons:
            return null;
        case ESpriteType.monstericons:
            const num = parseInt(second);
            return !isNaN(num) ? num : 0;
        default:
            return null;
    }
}

export function base(path: string): string {
    return path.split(/[/\\]/).pop() || "";
}

export function nameFromId(id: string, spriteType: ESpriteType): string {
    return spriteTypesRecord[spriteType](id);
}

type SortTypeFunc = (a: string, b: string) => number;

export function makeSortTypeFunc(sortType: ESortType, spriteType: ESpriteType): SortTypeFunc {
    switch (sortType) {
        case ESortType.nameAsc:
            return (a: string, b: string) => nameFromId(a, spriteType) > nameFromId(b, spriteType) ? 1 : -1;
        case ESortType.nameDesc:
            return (a: string, b: string) => nameFromId(a, spriteType) > nameFromId(b, spriteType) ? -1 : 1;
        case ESortType.idAsc:
            return (a: string, b: string) => a > b ? 1 : -1;
        case ESortType.idDesc:
            return (a: string, b: string) => a > b ? -1 : 1;
    }
}

type SpriteTypeMatcherFunc = (id: string) => string;

const spriteTypesRecord: Record<ESpriteType, SpriteTypeMatcherFunc> = {
    [ESpriteType.battlesprites]: battlespritesMatcher,
    [ESpriteType.followsprites]: followspritesMatcher,
    [ESpriteType.itemicons]: itemiconsMatcher,
    [ESpriteType.monstericons]: monstericonsMatcher,
};

function battlespritesMatcher(id: string): string {
    return pokemonDict[id] ?? "";
}

function followspritesMatcher(id: string): string {
    return pokemonDict[id] ?? "";
}

function itemiconsMatcher(id: string): string {
    return itemsDict[id] ?? "";
}

function monstericonsMatcher(id: string): string {
    return pokemonDict[id] ?? "";
}
