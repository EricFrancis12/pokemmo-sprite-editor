import React, { useState, useContext, useEffect } from "react";
import { main } from "../../wailsjs/go/models";
import { GetSpriteData, GetSpriteGroupData } from "../../wailsjs/go/main/App";
import toast from "react-hot-toast";
import { formatErr } from "../lib/utils";

export type TDataContext = {
    fetchData: () => Promise<[main.SpriteData, main.SpriteGroupData]>;
    refreshAndFetchData: () => Promise<[main.SpriteData, main.SpriteGroupData]>;

    fetchSpriteData: () => Promise<main.SpriteData>;
    refreshAndFetchSpriteData: () => Promise<main.SpriteData>;
    spriteData: main.SpriteData | null;
    setSpriteData: React.Dispatch<React.SetStateAction<main.SpriteData | null>>;

    fetchSpriteGroupData: () => Promise<main.SpriteGroupData>;
    refreshAndFetchSpriteGroupData: () => Promise<main.SpriteGroupData>;
    spriteGroupData: main.SpriteGroupData | null;
    setSpriteGroupData: React.Dispatch<React.SetStateAction<main.SpriteGroupData | null>>;

    loadingData: boolean;
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
    const [spriteData, setSpriteData] = useState<main.SpriteData | null>(null);
    const [spriteGroupData, setSpriteGroupData] = useState<main.SpriteGroupData | null>(null);
    const [loadingData, setLoadingData] = useState(false);

    async function fetchSpriteData() {
        setLoadingData(true);
        const prom = GetSpriteData();
        prom.then(setSpriteData);
        prom.catch(err => toast.error(formatErr(err).message));
        prom.finally(() => setLoadingData(false));
        return prom;
    }

    async function fetchSpriteGroupData() {
        setLoadingData(true);
        const prom = GetSpriteGroupData();
        prom.then(setSpriteGroupData);
        prom.catch(err => toast.error(formatErr(err).message));
        prom.finally(() => setLoadingData(false));
        return prom;
    }

    async function fetchData() {
        return Promise.all([
            fetchSpriteData(),
            fetchSpriteGroupData(),
        ]);
    }

    async function refreshAndFetchSpriteData() {
        setSpriteData(null);
        return fetchSpriteData();
    }

    async function refreshAndFetchSpriteGroupData() {
        setSpriteGroupData(null);
        return fetchSpriteGroupData();
    }

    async function refreshAndFetchData() {
        return Promise.all([
            refreshAndFetchSpriteData(),
            refreshAndFetchSpriteGroupData(),
        ]);
    }

    useEffect(() => {
        fetchData();
    }, []);

    const value = {
        fetchData,
        refreshAndFetchData,

        fetchSpriteData,
        refreshAndFetchSpriteData,
        spriteData,
        setSpriteData,

        fetchSpriteGroupData,
        refreshAndFetchSpriteGroupData,
        spriteGroupData,
        setSpriteGroupData,

        loadingData,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider >
    )
}
