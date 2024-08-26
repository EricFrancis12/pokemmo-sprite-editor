import { main } from "../../../wailsjs/go/models";
import { ESpriteType } from "../../lib/types";

export type TGroupMonstersData = {
    monsters: main.SpriteGroup[],
    itemicons: main.SpriteGroup[],
};

export function isMonsterGroup(spriteType: ESpriteType): boolean {
    return spriteType === ESpriteType.battlesprites
        || spriteType === ESpriteType.followsprites
        || spriteType === ESpriteType.monstericons;
}

export function toGroupMonstersData(spriteGroupData: main.SpriteGroupData): TGroupMonstersData {
    const result: TGroupMonstersData = {
        monsters: [],
        itemicons: [],
    };

    for (const key in spriteGroupData.data) {
        const spriteType = key as ESpriteType;
        const spriteGroups = spriteGroupData.data[spriteType];
        if (isMonsterGroup(spriteType)) {
            for (const spriteGroup of spriteGroups) {
                const index = result.monsters.findIndex(sg => sg.id === spriteGroup.id);
                if (index !== -1) {
                    result.monsters[index].sprites.push(...structuredClone(spriteGroup.sprites));
                } else {
                    result.monsters.push(structuredClone(spriteGroup));
                }
            }
        }
    }

    result.itemicons.push(...structuredClone(spriteGroupData.data[ESpriteType.itemicons]));

    return result;
}
