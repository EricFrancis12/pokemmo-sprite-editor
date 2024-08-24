import React, { useState } from "react";
import { TActionMenu, TActionMenu_spritesMapEditor } from "../../../lib/types";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import DynamicSprite from "../../DynamicSprite";
import { main } from "../../../../wailsjs/go/models";
import { ProcessSpriteImage } from "../../../../wailsjs/go/main/App";
import { spriteModdedPath } from "../../../lib/utils";
import { useDataContext } from "../../../contexts/DataContext";
import { EEditMode } from "../../../lib/types";
import { useEditModeContext } from "../../../contexts/EditModeContext";
import ColorEditor from "../../ColorEditor";
import ApplyButton from "../../ApplyButton";

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

export default function SpritesMapEditorBody({ actionMenu }: {
    actionMenu: TActionMenu_spritesMapEditor;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    const { fetchData } = useDataContext();
    const { editMode, setEditMode } = useEditModeContext();

    const [colorData, setColorData] = useState<main.ImageData>(initialColorData);

    const [spritesWithColorData, setSpritesWithColorData] = useState<SpriteWithColorData[]>(
        initialSpritesColorData(actionMenu.sprites)
    );

    const [loading, setLoading] = useState(false);

    function handleApplyAll() {
        if (editMode !== EEditMode.all || loading) return;

        setLoading(true);
        const proms = actionMenu.sprites.map(sprite => ProcessSpriteImage(sprite.origPath, spriteModdedPath(sprite), colorData));
        Promise.all(proms)
            .then(() => {
                fetchData().then(() => setTimeout(() => {
                    const prev = spritesWithColorData;
                    setSpritesWithColorData([]);
                    setTimeout(() => {
                        setSpritesWithColorData(prev.map(s => ({ ...s, wipImageData: colorData } as SpriteWithColorData)));
                        setLoading(false);
                    }, 0);
                }, 0));
            });
    }

    function handleApplySingle(_spriteWithColorData: SpriteWithColorData) {
        if (editMode !== EEditMode.single || loading) return;

        setLoading(true)
        ProcessSpriteImage(_spriteWithColorData.origPath, spriteModdedPath(_spriteWithColorData), _spriteWithColorData.wipImageData)
            .then(() => {
                fetchData().then(() => setTimeout(() => {
                    const prev = spritesWithColorData;
                    setSpritesWithColorData([]);
                    setTimeout(() => {
                        setSpritesWithColorData(prev);
                        setLoading(false);
                    }, 0);
                }, 0));
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
                            <ApplyButton
                                disabled={loading}
                                onClick={handleApplyAll}
                            />
                        </>
                    }
                </div>
                <div className="grid grid-cols-2 w-full">
                    {spritesWithColorData.map((spriteWithColorData, index) => (
                        <div key={spriteWithColorData.fileName}>
                            <DynamicSprite sprite={spriteWithColorData} />
                            {editMode === EEditMode.single &&
                                <>
                                    <ColorEditor
                                        colorData={spriteWithColorData.wipImageData}
                                        onChange={imageData => setSpritesWithColorData(
                                            prev => prev.map((s, i) => i === index ? { ...s, wipImageData: imageData } as SpriteWithColorData : s)
                                        )}
                                    />
                                    <ApplyButton
                                        disabled={loading}
                                        onClick={() => handleApplySingle(spriteWithColorData)}
                                    />
                                </>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </ActionMenuBodyWrapper>
    )
}
