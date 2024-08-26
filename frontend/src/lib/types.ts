import { main } from "../../wailsjs/go/models";

export enum EActionMenuType {
    spritesMapEditor = "sprites-map-editor",
}

export type TActionMenu_spritesMapEditor = {
    type: EActionMenuType.spritesMapEditor;
    sprites: main.Sprite[];
}

export type TActionMenu = TActionMenu_spritesMapEditor;

export enum EEditMode {
    all = "all",
    single = "single",
}

export enum ESortType {
    nameAsc = "nameAsc",
    nameDesc = "nameDesc",
    idAsc = "idAsc",
    idDesc = "idDesc",
}

export enum ESpriteType {
    battlesprites = "battlesprites",
    followsprites = "followersprites",
    itemicons = "itemicons",
    monstericons = "monstericons",
}
