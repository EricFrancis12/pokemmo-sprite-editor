import { main } from "../../wailsjs/go/models";

export enum EDirName {
    sprites = "sprites",
    moddedSprites = "modded-sprites",
    mod = "mod",
    frontend = "frontend",
    dist = "dist",
    public = "public",
}

export enum ESpriteType {
    battlesprites = "battlesprites",
    followsprites = "followersprites",
    itemicons = "itemicons",
    monstericons = "monstericons",
}

export enum ESortType {
    nameAsc = "nameAsc",
    nameDesc = "nameDesc",
    idAsc = "idAsc",
    idDesc = "idDesc",
}

export enum EEditMode {
    all = "all",
    single = "single",
}

export enum EGender {
    male = "m",
    female = "f",
    both = "b",
}

export enum EShiny {
    normal = "n",
    shiny = "s",
}

export enum EFacing {
    front = "front",
    back = "back",
}

export type TSpritesMap = {
    [key: string]: main.Sprite[];
};

export enum EActionMenuType {
    spritesMapEditor = "sprites-map-editor",
}

export type TActionMenu_spritesMapEditor = {
    type: EActionMenuType.spritesMapEditor;
    sprites: main.Sprite[];
}

export type TActionMenu = TActionMenu_spritesMapEditor;
