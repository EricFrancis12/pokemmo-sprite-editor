import React from "react";
import { TActionMenu, TActionMenu_spritesMapEditor } from "../../../lib/types";
import ActionMenuBodyWrapper from "../ActionMenuBodyWrapper";

export default function SpritesMapEditorBody({ actionMenu, setActionMenu }: {
    actionMenu: TActionMenu_spritesMapEditor;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    return (
        <ActionMenuBodyWrapper>
            <div className="flex flex-col gap-4 w-full p-2">
                <span>{actionMenu.type}</span>
            </div>
        </ActionMenuBodyWrapper>
    )
}
