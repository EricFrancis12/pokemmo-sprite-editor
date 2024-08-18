import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListPage from "./views/ListPage";
import { DataProvider } from "./contexts/DataContext";

export default function App() {
    return (
        <DataProvider>
            <Router>
                <Routes>
                    <Route index element={<ListPage />} />
                    <Route path="*" element={<div>Not Found</div>} />
                </Routes>
            </Router>
        </DataProvider>
    )
}
