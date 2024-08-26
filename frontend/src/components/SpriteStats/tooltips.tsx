import React from "react";
import { EFacing, EGender, EShiny } from "../../lib/types";
import * as icons from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft, faArrowRight, faGenderless, faStar, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import IconWithTooltip from "../IconWithTooltip";

export function GenderIconWithTooltip({ gender }: {
    gender: EGender;
}) {
    return (
        <IconWithTooltip
            icon={faGenderless}
            tooltip={tooltipFromGenderRecord[gender]}
            className={classNameFromGenderRecord[gender]}
        />
    )
}

const tooltipFromGenderRecord: Record<EGender, string> = {
    [EGender.female]: "Female sprite",
    [EGender.male]: "Male sprite",
    [EGender.both]: "Male and Female sprite",
};

const classNameFromGenderRecord: Record<EGender, string> = {
    [EGender.female]: "text-pink-400",
    [EGender.male]: "text-blue-400",
    [EGender.both]: "text-purple-400",
};

export function ShinyIconWithTooltip({ shiny }: {
    shiny: EShiny;
}) {
    return (
        <IconWithTooltip
            icon={faStar}
            tooltip={tooltipFromShinyRecord[shiny]}
            className={shiny === EShiny.shiny ? "text-yellow-400" : "text-gray-400"}
        />
    )
}

const tooltipFromShinyRecord: Record<EShiny, string> = {
    [EShiny.normal]: "Non-shiny sprite",
    [EShiny.shiny]: "Shiny sprite",
};

export function FacingIconWithTooltip({ facing }: {
    facing: EFacing;
}) {
    return (
        <IconWithTooltip
            icon={iconFromFacingRecord[facing]}
            tooltip={tooltipFromFacingRecord[facing]}
        />
    )
}

const iconFromFacingRecord: Record<EFacing, IconDefinition> = {
    [EFacing.front]: faArrowLeft,
    [EFacing.back]: faArrowRight,
};

const tooltipFromFacingRecord: Record<EFacing, string> = {
    [EFacing.front]: "Front-facing sprite",
    [EFacing.back]: "Back-facing sprite",
};

export function FrameIconWithTooltip({ frame }: {
    frame: number;
}) {
    return (
        <IconWithTooltip
            icon={iconFromFrame(frame)}
            tooltip={`Sprite frame ${frame}`}
            className="text-sm"
        />
    )
}

function iconFromFrame(frame: number): IconDefinition {
    const icon = icons[`fa${frame}` as keyof typeof icons];
    return icon as IconDefinition ?? null;
}
