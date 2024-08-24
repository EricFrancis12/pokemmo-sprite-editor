import React, { ReactNode, useEffect, useState } from "react";
import { TActionMenu, TActionMenu_spritesMapEditor } from "../../../lib/types";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import { DynamicSprite } from "../../../pages/ListPage";
import { main } from "../../../../wailsjs/go/models";
import { ProcessSpriteImage } from "../../../../wailsjs/go/main/App";
import { spriteModdedPath } from "../../../lib/utils";
import { useDataContext } from "../../../contexts/DataContext";
import { EEditMode } from "../../../lib/types";
import { useEditModeContext } from "../../../contexts/EditModeContext";

export type SpriteWithColorData = main.Sprite & {
    wipImageData: main.ImageData;
};

const initialColorData: main.ImageData = {
    hue: 0,
    saturation: 0,
};

export function toSpriteWithColorData(sprite: main.Sprite): SpriteWithColorData {
    return { ...sprite, wipImageData: sprite.imageData } as SpriteWithColorData;
}

function initialSpritesColorData(sprites: main.Sprite[]): SpriteWithColorData[] {
    return sprites.map(toSpriteWithColorData);
}

export default function SpritesMapEditorBody({ actionMenu, setActionMenu }: {
    actionMenu: TActionMenu_spritesMapEditor;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    const { fetchData } = useDataContext();
    const { editMode, setEditMode } = useEditModeContext();

    const [colorData, setColorData] = useState<main.ImageData>(initialColorData);

    const [spritesWithColorData, setSpritesWithColorData] = useState<SpriteWithColorData[]>(
        initialSpritesColorData(actionMenu.sprites)
    );

    function handleApplyAll() {
        if (editMode !== EEditMode.all) return;
        const proms = actionMenu.sprites.map(sprite => ProcessSpriteImage(sprite.origPath, spriteModdedPath(sprite), colorData));
        Promise.all(proms)
            .then(() => {
                fetchData();
            });
    }

    function handleApplySingle(_spriteWithColorData: SpriteWithColorData) {
        if (editMode !== EEditMode.single) return;
        ProcessSpriteImage(_spriteWithColorData.origPath, spriteModdedPath(_spriteWithColorData), _spriteWithColorData.wipImageData)
            .then(() => {
                fetchData();
            });
    }

    return (
        <ActionMenuBodyWrapper>
            <div className="flex flex-col gap-4 w-full h-full p-2">
                <div className="flex justify-center items-center gap-2 h-[40px] w-full">
                    {Object.values(EEditMode).map((_editMode, index) => (
                        <div key={index} className="flex justify-center items-center gap-2">
                            <span>{_editMode}</span>
                            <input
                                type="checkbox"
                                checked={editMode === _editMode}
                                onChange={() => setEditMode(_editMode)}
                            />
                        </div>
                    ))}
                    {editMode === EEditMode.all &&
                        <>
                            <ColorEditor
                                colorData={colorData}
                                onChange={setColorData}
                            />
                            <button
                                className="px-2 py-1 rounded bg-green-300"
                                onClick={handleApplyAll}
                            >
                                Apply
                            </button>
                        </>
                    }
                </div>
                <div className="grid grid-cols-2 w-full">
                    {spritesWithColorData.map((spriteWithColorData, index) => (
                        <div key={index}>
                            <DynamicSprite sprite={spriteWithColorData} />
                            {editMode === EEditMode.single &&
                                <>
                                    <ColorEditor
                                        colorData={spriteWithColorData.wipImageData}
                                        onChange={imageData => setSpritesWithColorData(
                                            prev => prev.map((s, i) => i === index ? { ...s, wipImageData: imageData } as SpriteWithColorData : s)
                                        )}
                                    />
                                    <button
                                        className="px-2 py-1 rounded bg-green-300"
                                        onClick={() => handleApplySingle(spriteWithColorData)}
                                    >
                                        Apply
                                    </button>
                                </>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </ActionMenuBodyWrapper>
    )
}

function ColorEditor({ colorData, onChange }: {
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
    children: ReactNode;
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


function RangeSlider({ value, onChange, min, max, step, className, style }: {
    value: number;
    onChange: (n: number) => void;
    min: number;
    max: number;
    step: number;
    className?: string;
    style?: React.CSSProperties;
}) {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const n = parseFloat(e.target.value);
        if (!isNaN(n)) onChange(n);
    }

    return (
        <input
            type="range"
            className={className} style={style}
            step={step}
            min={min}
            max={max}
            value={value}
            onChange={handleChange}
        />
    )
}
