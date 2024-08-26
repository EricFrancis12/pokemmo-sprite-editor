import React from "react";
import { EActionMenuType, ESpriteType } from "../../lib/types";
import { main } from "../../../wailsjs/go/models";
import { useActionMenuContext } from "../../contexts/ActionMenuContext";

export default function SpriteGroups({ spriteGroups, onClick }: {
    spriteGroups: main.SpriteGroup[];
    onClick: (sg: main.SpriteGroup) => void;
}) {
    return (
        <div className="grid grid-cols-4 w-full">
            {spriteGroups.map((spriteGroup, index) => (
                <div key={index} className="flex justify-center items-center my-4 bg-blue-200">
                    <div
                        className="flex justify-center items-center m-2 cursor-pointer"
                        onClick={() => onClick(spriteGroup)}
                    >
                        {spriteGroup.sprites.map((sprite, _index) => {
                            return _index === spriteGroup.sprites.length - 1
                                ? <img key={_index} src={sprite.url} />
                                : null
                        })}
                    </div>
                </div>
            )
            )}
        </div>
    )
}
