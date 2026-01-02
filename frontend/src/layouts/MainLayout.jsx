import React from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
                px: 0,
            }}
        >

            {/* Top Navbar */}
            <Navbar />

            {/* Main content area */}
            <Container
                disableGutters
                maxWidth="xl"
                sx={{
                    px: 0,
                    flexGrow: 1,
                }}
            >
                <Outlet />
            </Container>
        </Box>
    );
};

export default MainLayout;