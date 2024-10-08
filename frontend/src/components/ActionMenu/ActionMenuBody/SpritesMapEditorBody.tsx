import React, { useState } from "react";
import { TActionMenu, TActionMenu_spritesMapEditor } from "../../../lib/types";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";
import { main } from "../../../../wailsjs/go/models";
import { ProcessSprite, ProcessSprites } from "../../../../wailsjs/go/main/App";
import { useDataContext } from "../../../contexts/DataContext";
import { EEditMode } from "../../../lib/types";
import { useEditModeContext } from "../../../contexts/EditModeContext";
import ColorEditor from "../../ColorEditor";
import { ApplyButton } from "../../buttons";
import SpriteStats from "../../SpriteStats";
import toast from "react-hot-toast";
import { formatErr } from "../../../lib/utils";

type WIPSprite = main.Sprite & {
    wipImageData: main.ImageData;
};

const initialImageData: main.ImageData = {
    hue: 0,
    saturation: 0,
};

function toWIPSprite(sprite: main.Sprite): WIPSprite {
    return { ...sprite, wipImageData: structuredClone(sprite.imageData) } as WIPSprite;
}

function initialSpritesImageData(sprites: main.Sprite[]): WIPSprite[] {
    return sprites.map(toWIPSprite);
}

export default function SpritesMapEditorBody({ actionMenu }: {
    actionMenu: TActionMenu_spritesMapEditor;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    const { fetchData } = useDataContext();
    const { editMode, setEditMode } = useEditModeContext();

    const [imageData, setImageData] = useState<main.ImageData>(initialImageData);

    const [wipSprites, setWipSprites] = useState<WIPSprite[]>(
        initialSpritesImageData(actionMenu.sprites)
    );

    const [loading, setLoading] = useState(false);

    function handleApplySingle(wipSprite: WIPSprite) {
        if (editMode !== EEditMode.single) return;
        setLoading(true);
        ProcessSprite(wipSprite, wipSprite.wipImageData)
            .then(() => refreshSingle().then(() => toast.success("Updated Sprite")))
            .catch(err => {
                toast.error(formatErr(err).message);
                setLoading(false);
            });
    }

    function handleApplyAll() {
        if (editMode !== EEditMode.all) return;
        setLoading(true);
        ProcessSprites(actionMenu.sprites, imageData)
            .then(() => refreshAll().then(() => toast.success("Updated Sprites")))
            .catch(err => {
                toast.error(formatErr(err).message);
                setLoading(false);
            });
    }

    async function refreshSingle() {
        return fetchData().then(() => setTimeout(() => {
            const prev = wipSprites;
            setWipSprites([]);
            setTimeout(() => {
                setWipSprites(prev);
                setLoading(false)
            }, 0);
        }, 0));
    }

    async function refreshAll() {
        return fetchData().then(() => setTimeout(() => {
            const prev = wipSprites;
            setWipSprites([]);
            setTimeout(() => {
                setWipSprites(prev.map(s => ({ ...s, wipImageData: structuredClone(imageData) } as WIPSprite)));
                setLoading(false)
            }, 0);
        }, 0));
    }

    return (
        <ActionMenuBodyWrapper>
            <div className="flex flex-col items-center gap-4 w-full h-full p-2">
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
                </div>
                {editMode === EEditMode.all &&
                    <div className="flex gap-3">
                        <ColorEditor
                            colorData={imageData}
                            onChange={setImageData}
                        />
                        <div>
                            <ApplyButton
                                disabled={loading}
                                onClick={handleApplyAll}
                            />
                        </div>
                    </div>
                }
                <div className="grid grid-cols-2 gap-4 w-full">
                    {wipSprites.map((wipSprite, index) => (
                        <div key={wipSprite.fileName} className="px-4 py-2 border border-black rounded-md">
                            <div className="flex gap-2">
                                <div className="flex justify-center items-center">
                                    <img src={wipSprite.url} className="m-4" />
                                </div>
                                <SpriteStats sprite={wipSprite} />
                            </div>
                            {editMode === EEditMode.single &&
                                <div className="flex gap-3">
                                    <ColorEditor
                                        colorData={wipSprite.wipImageData}
                                        onChange={imageData => setWipSprites(
                                            prev => prev.map(
                                                (spr, i) => i === index
                                                    ? { ...spr, wipImageData: structuredClone(imageData) } as WIPSprite
                                                    : spr
                                            )
                                        )}
                                    />
                                    <div>
                                        <ApplyButton
                                            disabled={loading}
                                            onClick={() => handleApplySingle(wipSprite)}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </div>
        </ActionMenuBodyWrapper>
    )
}
