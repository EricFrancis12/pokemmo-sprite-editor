import React from "react";
import { main } from "../../../wailsjs/go/models";
import { EFacing, EGender, EShiny, ESpriteType, SpriteData } from "../../lib/types";

export function getSpriteData(sprite: main.Sprite): SpriteData {
    return {
        gender: spriteGender(sprite),
        shiny: spriteShiny(sprite),
        facing: spriteFacing(sprite),
        frame: spriteFrame(sprite),
    };
}

function spriteGender(sprite: main.Sprite): EGender | null {
    const [basename] = sprite.fileName.split(".");
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

function spriteShiny(sprite: main.Sprite): EShiny | null {
    const [basename] = sprite.fileName.split(".");
    if (!basename) return null;

    const splitOnDash = basename.split("-");
    const third = splitOnDash[2] ?? "";

    switch (sprite.spriteType) {
        case ESpriteType.battlesprites:
            return (Object.values(EShiny) as string[]).includes(third) ? third as EShiny : null;
        case ESpriteType.followsprites:
            return (Object.values(EShiny) as string[]).includes(third) ? third as EShiny : null;
        case ESpriteType.itemicons:
            return null;
        case ESpriteType.monstericons:
            return null;
        default:
            return null;
    }
}

function spriteFacing(sprite: main.Sprite): EFacing | null {
    const [basename] = sprite.fileName.split(".");
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

function spriteFrame(sprite: main.Sprite): number | null {
    const [basename] = sprite.fileName.split(".");
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
