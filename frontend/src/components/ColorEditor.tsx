import React from "react";
import { main } from "../../wailsjs/go/models";
import RangeSlider from "./RangeSlider";

export default function ColorEditor({ colorData, onChange }: {
    colorData: main.ImageData;
    onChange: (newColorData: main.ImageData) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <ColorEditorRow
                title="Hue"
                value={colorData.hue}
            >
                <RangeSlider
                    value={colorData.hue}
                    onChange={(hue: number) => onChange({ ...colorData, hue })}
                    min={-360}
                    max={360}
                    step={1}
                />
            </ColorEditorRow>
            <ColorEditorRow
                title="Saturation"
                value={colorData.saturation}
            >
                <RangeSlider
                    value={colorData.saturation}
                    onChange={saturation => onChange({ ...colorData, saturation })}
                    min={-1}
                    max={1}
                    step={0.1}
                />
            </ColorEditorRow>
        </div>
    )
}

function ColorEditorRow({ value, children, title }: {
    value: number;
    children: React.ReactNode;
    title: string;
}) {
    return (
        <div className="flex items-center gap-3 h-full">
            <div className="w-[20px]">{value}</div>
            {children}
            <span>{title}</span>
        </div>
    )
}
