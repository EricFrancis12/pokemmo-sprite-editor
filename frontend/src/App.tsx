import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListPage from "./pages/ListPage";
import { ActionMenuProvider } from "./contexts/ActionMenuContext";
import { DataProvider } from "./contexts/DataContext";
import { EditModeProvider } from "./contexts/EditModeContext";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <AppContextProvider>
            <Toaster />
            <Router>
                <Routes>
                    <Route index element={<ListPage />} />
                    <Route path="*" element={<div>Not Found</div>} />
                </Routes>
            </Router>
        </AppContextProvider>
    )
}

function AppContextProvider({ children }: {
    children: React.ReactNode;
}) {
    return (
        <DataProvider>
            <EditModeProvider>
                <ActionMenuProvider>
                    {children}
                </ActionMenuProvider>
            </EditModeProvider>
        </DataProvider>

    )
}
