import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import WorkspacePage from '../pages/WorkspacePage';
import BoardsPage from '../pages/BoardsPage';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/workspaces" element={<WorkspacePage />} />
                    <Route path="/workspaces/:workspaceId" element={<BoardsPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
