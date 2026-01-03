import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import WorkspacePage from '../pages/WorkspacePage';
import BoardsPage from '../pages/BoardsPage';
import BoardDetails from '../pages/BoardDetails';


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/workspaces" element={<WorkspacePage />} />
                    {/* Workspaces → Boards */}
                    <Route
                        path="/workspaces/:workspaceId"
                        element={<BoardsPage />}
                    />

                    Board Details
                    <Route
                        path="/boards/:workspaceId/:boardId"
                        element={<BoardDetails />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
