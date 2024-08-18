import SpritesMapEditorBody from "./SpritesMapEditorBody";
import { EActionMenuType, TActionMenu } from "../../../lib/types";

export default function ActionMenuBody({ actionMenu, setActionMenu }: {
    actionMenu: TActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    switch (actionMenu.type) {
        case EActionMenuType.spritesMapEditor:
            return <SpritesMapEditorBody actionMenu={actionMenu} setActionMenu={setActionMenu} />;
        default:
            return null;
    }
}
