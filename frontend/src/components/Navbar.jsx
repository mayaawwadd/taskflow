import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Button,
    Box,
} from '@mui/material';
import { LogOut, Moon, Sun } from 'lucide-react';
import Logo from '../assets/Logo.png';
import { useTheme } from '@mui/material/styles';
import { useThemeStore } from '../store/themeStore';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { mode, toggleMode } = useThemeStore();

    // ✅ AUTH CONTEXT (single source of truth)
    const { isAuthenticated, logout } = useAuth();

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                top: 0,
                backdropFilter: 'blur(10px)',
                backgroundColor: `${theme.palette.background.paper}CC`,
                borderBottom: `1px solid ${theme.palette.divider}`,
                zIndex: 1100,
                width: '100vw',
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 2,
                    py: 1,
                }}
            >
                {/* Left side: logo + title */}
                <Box display="flex" alignItems="center" gap={1.5}>
                    <Box
                        sx={{
                            width: 64,
                            height: 64,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <img
                            src={Logo}
                            alt="Logo"
                            style={{
                                width: '150px',
                                height: '160px',
                                objectFit: 'contain',
                            }}
                        />
                    </Box>
                    <Typography
                        sx={{ color: theme.palette.text.primary }}
                        variant="h6"
                        fontWeight="600"
                    >
                        TaskFlow
                    </Typography>
                </Box>

                {/* Right side: theme toggle + auth button */}
                <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                        onClick={toggleMode}
                        sx={{
                            color: theme.palette.text.primary,
                            borderRadius: 2,
                            transition:
                                'color 0.25s ease-in-out, background 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
                            '&:hover': {
                                background: `linear-gradient(-45deg, ${theme.palette.primary[300]}, ${theme.palette.accent.main})`,
                                color: theme.palette.common.white,
                                boxShadow: `0 4px 10px ${theme.palette.primary.main}33`,
                            },
                            '&:focus': { outline: 'none' },
                            '&:focus-visible': { outline: 'none' },
                        }}
                    >
                        {mode === 'light' ? (
                            <Moon size={20} strokeWidth={1.5} />
                        ) : (
                            <Sun size={20} strokeWidth={1.5} />
                        )}
                    </IconButton>

                    {isAuthenticated ? (
                        <Button
                            variant="text"
                            onClick={logout}
                            sx={{
                                textTransform: 'none',
                                fontWeight: 500,
                                color: theme.palette.text.primary,
                                borderRadius: 2,
                                px: 2,
                                py: 0.7,
                                gap: 0.7,
                                transition:
                                    'color 0.25s ease-in-out, background 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
                                '&:hover': {
                                    background: `linear-gradient(-45deg, ${theme.palette.primary[400]}, ${theme.palette.accent.main})`,
                                    color: theme.palette.common.white,
                                    boxShadow: `0 4px 10px ${theme.palette.primary.main}33`,
                                },
                                '&:focus': { outline: 'none' },
                                '&:focus-visible': { outline: 'none' },
                            }}
                        >
                            <LogOut size={18} />
                            Logout
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                            sx={{
                                background: `linear-gradient(-45deg, ${theme.palette.primary[400]}, ${theme.palette.accent.main})`,
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 2,
                                py: 0.7,
                                fontWeight: 500,
                                transition: '0.3s ease-in-out',
                                '&:hover': {
                                    opacity: 0.9,
                                    color: theme.palette.text.white,
                                    boxShadow: `0 4px 10px ${theme.palette.primary.main}33`,
                                },
                                '&:focus': { outline: 'none' },
                                '&:focus-visible': { outline: 'none' },
                            }}
                        >
                            Get Started
                        </Button>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
