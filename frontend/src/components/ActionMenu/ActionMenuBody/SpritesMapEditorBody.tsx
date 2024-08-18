import React, { useState } from "react";
import { TActionMenu, TActionMenu_spritesMapEditor } from "../../../lib/types";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import { DynamicSprite } from "../../../views/ListPage";
import { main } from "../../../../wailsjs/go/models";
import { ProcessPng, SpritesTree } from "../../../../wailsjs/go/main/App";
import { spriteModdedPath } from "../../../lib/utils";

enum EEditMode {
    single = "single",
    all = "all",
}

interface IColorData {
    hue: number;
    saturation: number;
    // TODO: ...
}

type SpriteWithColorData = main.Sprite & IColorData;

function initialSpritesColorData(sprites: main.Sprite[]): SpriteWithColorData[] {
    return sprites.map(sprite => ({ ...sprite, hue: 120, saturation: 120 }));
}

export default function SpritesMapEditorBody({ actionMenu, setActionMenu }: {
    actionMenu: TActionMenu_spritesMapEditor;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    const [editMode, setEditMode] = useState<EEditMode>(EEditMode.all);

    const [colorData, setColorData] = useState<IColorData>({ hue: 100, saturation: 100 });
    const [spritesWithColorData, setSpritesWithColorData] = useState<SpriteWithColorData[]>(
        initialSpritesColorData(actionMenu.sprites)
    );

    function handleApply() {
        // TODO: ...
        if (actionMenu.sprites[0]) {
            ProcessPng(actionMenu.sprites[0].origPath, spriteModdedPath(actionMenu.sprites[0]), colorData);
        }
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
                        <ColorEditor
                            colorData={colorData}
                            onChange={setColorData}
                        />
                    }
                    <button
                        className="px-2 py-1 rounded bg-green-300"
                        onClick={handleApply}
                    >
                        Apply
                    </button>
                </div>
                <div className="grid grid-cols-4 w-full">
                    {spritesWithColorData.map((spriteWithColorData, index) => (
                        <div key={index}>
                            <DynamicSprite sprite={spriteWithColorData} />
                            {editMode === EEditMode.single &&
                                <ColorEditor
                                    colorData={spriteWithColorData}
                                    onChange={newSpriteWithColorData => setSpritesWithColorData(
                                        prev => prev.map((s, i) => i === index ? { ...s, ...newSpriteWithColorData } : s)
                                    )}
                                />
                            }
                        </div>
                    ))}
                </div>
            </div>
        </ActionMenuBodyWrapper>
    )
}

function ColorEditor({ colorData, onChange }: {
    colorData: IColorData;
    onChange: (newColorData: IColorData) => void;
}) {
    return (
        <div>
            ColorEditor
        </div>
    )
}
