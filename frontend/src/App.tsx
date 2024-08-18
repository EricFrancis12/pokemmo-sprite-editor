import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ListPage from "./views/ListPage";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route index element={<ListPage />} />
                <Route path="*" element={<div>Not Found</div>} />
            </Routes>
        </Router>
    )
}
