import React from "react";
import ActionMenuHeader from "./ActionMenuHeader";
import ActionMenuBody from "./ActionMenuBody";
import { TActionMenu } from "../../lib/types";

export default function ActionMenu({ actionMenu, setActionMenu }: {
    actionMenu: TActionMenu;
    setActionMenu: React.Dispatch<React.SetStateAction<TActionMenu | null>>;
}) {
    return (
        <div className="flex flex-col items-center bg-white rounded-md">
            <ActionMenuHeader
                title={actionMenu.title}
                onClose={() => setActionMenu(null)}
            />
            <div className="h-[85vh] w-[85vw] sm:min-w-[400px] overflow-y-scroll">
                <ActionMenuBody actionMenu={actionMenu} setActionMenu={setActionMenu} />
            </div>
            <div className="h-[20px] w-full" />
        </div>
    )
}
