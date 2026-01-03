import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';

import Home from '../pages/Home';
import WorkspacePage from '../pages/WorkspacePage';
import BoardsPage from '../pages/BoardsPage';
import BoardDetails from '../pages/BoardDetails';
import Login from '../pages/Login';
import Register from '../pages/Register';

import { AuthProvider } from '../context/AuthContext';
import ProtectedRoute from '../routes/ProtectedRoute';
import PublicRoute from '../routes/PublicRoute';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route element={<PublicRoute />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>
                    </Route>


                    <Route element={<MainLayout />}>
                        <Route path='/home' element={<Home />} />
                        <Route element={<ProtectedRoute />}>

                            <Route path="/workspaces" element={<WorkspacePage />} />
                            <Route
                                path="/workspaces/:workspaceId"
                                element={<BoardsPage />}
                            />
                            <Route
                                path="/boards/:workspaceId/:boardId"
                                element={<BoardDetails />}
                            />
                        </Route>

                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default AppRouter;
