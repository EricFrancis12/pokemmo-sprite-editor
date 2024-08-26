import React from "react";
import { main } from "../../../wailsjs/go/models";
import { getSpriteData } from "./spriteData";
import { FacingIconWithTooltip, FrameIconWithTooltip, GenderIconWithTooltip, ShinyIconWithTooltip } from "./tooltips";

export default function SpriteStats({ sprite }: {
    sprite: main.Sprite;
}) {
    const { gender, shiny, facing, frame } = getSpriteData(sprite);

    return (
        <div className="flex flex-col items-center gap-1">
            {gender !== null && <GenderIconWithTooltip gender={gender} />}
            {shiny !== null && <ShinyIconWithTooltip shiny={shiny} />}
            {facing !== null && <FacingIconWithTooltip facing={facing} />}
            {frame !== null && <FrameIconWithTooltip frame={frame} />}
        </div>
    )
}
