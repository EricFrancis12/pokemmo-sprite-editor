import React from "react";
import { EActionMenuType, ESpriteType } from "../../lib/types";
import { main } from "../../../wailsjs/go/models";
import { useActionMenuContext } from "../../contexts/ActionMenuContext";
import DynamicSprite from "../../components/DynamicSprite";

export default function Sprites({ ids, spriteType, spritesTree }: {
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
                    <div key={index} className="flex justify-center items-center my-4 bg-blue-200">
                        <div
                            className="flex justify-center items-center m-2 cursor-pointer"
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
