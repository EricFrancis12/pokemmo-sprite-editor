import React, { useState, useContext } from "react";
import { EEditMode } from "../lib/types";

export type TEditModeContext = {
    editMode: EEditMode;
    setEditMode: React.Dispatch<React.SetStateAction<EEditMode>>;
};

const EditModeContext = React.createContext<TEditModeContext | null>(null);

export function useEditModeContext() {
    const context = useContext(EditModeContext);
    if (!context) {
        throw new Error("useEditModeContext must be used within a EditModeContext provider");
    }
    return context;
}

export function EditModeProvider({ children }: {
    children: React.ReactNode;
}) {
    const [editMode, setEditMode] = useState<EEditMode>(EEditMode.all);

    const value = {
        editMode,
        setEditMode,
    };

    return (
        <EditModeContext.Provider value={value}>
            {children}
        </EditModeContext.Provider >
    )
}
