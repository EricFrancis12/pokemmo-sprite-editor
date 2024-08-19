import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListPage from "./pages/ListPage";
import { DataProvider } from "./contexts/DataContext";
import { EditModeProvider } from "./contexts/EditModeContext";

export default function App() {
    return (
        <DataProvider>
            <EditModeProvider>
                <Router>
                    <Routes>
                        <Route index element={<ListPage />} />
                        <Route path="*" element={<div>Not Found</div>} />
                    </Routes>
                </Router>
            </EditModeProvider>
        </DataProvider>
    )
}
