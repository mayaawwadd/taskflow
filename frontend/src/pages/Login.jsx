import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Checkbox,
    Container,
    InputLabel,
    FormControlLabel,
    IconButton,
    InputAdornment,
    FormControl,
    Typography,
    OutlinedInput,
    useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FcGoogle } from 'react-icons/fc';
import Illustration from '../assets/Illustration.png';

import { login as loginAPI } from '../api/auth';
import { notify } from '../utils/toast';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { login: authLogin } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;
        const email = form.email.value.trim();
        const password = form.password.value;

        try {
            const { token, user } = await loginAPI(email, password);

            authLogin(user, token, rememberMe);

            notify.success('Welcome back!');
            navigate('/workspaces');
        } catch (err) {
            notify.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
            <Box
                flex={1}
                sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'center' }}
            >
                <img src={Illustration} alt="Welcome Back" style={{ width: '75%' }} />
            </Box>

            <Container maxWidth="sm" sx={{ flex: 1 }}>
                <Typography variant="h4" fontWeight={700} mb={1}>
                    Welcome back!
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={3}>
                    Please enter your details
                </Typography>

                <Box component="form" onSubmit={handleLoginSubmit}>
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Email</InputLabel>
                        <OutlinedInput name="email" label="Email" />
                    </FormControl>

                    <FormControl fullWidth required sx={{ mb: 1 }}>
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(p => !p)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <FormControlLabel
                        sx={{ mb: 2 }}
                        control={
                            <Checkbox
                                size="small"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                        }
                        label="Remember me"
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
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
                        {loading ? 'Signing in…' : 'Log In'}
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<FcGoogle />}
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
                            mt: 2,
                            mb: 2,
                        }}
                        onClick={() => notify.info('Google login coming soon')}
                    >
                        Log in with Google
                    </Button>

                    <Typography variant="body2" align="center">
                        Don’t have an account?{' '}
                        <Link to="/register" style={{ color: theme.palette.primary.main }}>
                            Sign up
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Container>
    );
};

export default Login;
