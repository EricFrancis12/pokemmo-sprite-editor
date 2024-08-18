import React, { useState, useContext, useEffect } from "react";
import { main } from "../../wailsjs/go/models";
import { SpritesTree } from "../../wailsjs/go/main/App";

export type TDataContext = {
    fetchData: () => Promise<main.Tree>;
    spritesTree: main.Tree | null;
    setSpritesTree: React.Dispatch<React.SetStateAction<main.Tree | null>>;
};

const DataContext = React.createContext<TDataContext | null>(null);

export function useDataContext() {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within a DataContext provider");
    }
    return context;
}

export function DataProvider({ children }: {
    children: React.ReactNode;
}) {
    const [spritesTree, setSpritesTree] = useState<main.Tree | null>(null);

    async function fetchData() {
        const prom = SpritesTree();
        prom.then(setSpritesTree);
        return prom;
    }

    useEffect(() => {
        fetchData();
    }, []);

    const value = {
        fetchData,
        spritesTree,
        setSpritesTree,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider >
    )
}
