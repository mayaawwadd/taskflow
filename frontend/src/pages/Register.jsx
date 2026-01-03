import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
    OutlinedInput,
    InputAdornment,
    IconButton,
    Typography,
    useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FcGoogle } from 'react-icons/fc';
import Illustration from '../assets/Illustration.png';
import { register } from '../api/auth';
import { notify } from '../utils/toast';

const Register = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const firstName = e.target.firstName.value.trim();
        const lastName = e.target.lastName.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        if (password !== confirmPassword) {
            notify.error('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await register({
                firstName,
                lastName,
                email,
                password,
            });

            notify.success('Account created successfully');
            navigate('/login');
        } catch (err) {
            notify.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            maxWidth="lg"
            sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center' }}
        >
            {/* ---------- LEFT IMAGE ---------- */}
            <Box
                flex={1}
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <img
                    src={Illustration}
                    alt="Create Account"
                    style={{ width: '75%', height: '75%', objectFit: 'cover' }}
                />
            </Box>

            {/* ---------- FORM ---------- */}
            <Container
                maxWidth="sm"
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h4" fontWeight={700} mb={1}>
                    Create your account
                </Typography>

                <Typography variant="body2" color="text.secondary" mb={3}>
                    Please enter your details
                </Typography>

                <Box component="form" onSubmit={handleRegisterSubmit}>
                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>First Name</InputLabel>
                        <OutlinedInput name="firstName" label="First Name" />
                    </FormControl>

                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Last Name</InputLabel>
                        <OutlinedInput name="lastName" label="Last Name" />
                    </FormControl>

                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Email</InputLabel>
                        <OutlinedInput name="email" label="Email" type="email" />
                    </FormControl>

                    <FormControl fullWidth required sx={{ mb: 2 }}>
                        <InputLabel>Password</InputLabel>
                        <OutlinedInput
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            label="Password"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword((p) => !p)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <FormControl fullWidth required sx={{ mb: 3 }}>
                        <InputLabel>Confirm Password</InputLabel>
                        <OutlinedInput
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            label="Confirm Password"
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowConfirmPassword((p) => !p)
                                        }
                                        edge="end"
                                    >
                                        {showConfirmPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

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
                            mb: 2,
                            transition: '0.3s ease-in-out',
                            '&:hover': {
                                opacity: 0.9,
                                color: theme.palette.text.white,
                                boxShadow: `0 4px 10px ${theme.palette.primary.main}33`,
                            },
                        }}
                    >
                        {loading ? 'Creating account…' : 'Sign Up'}
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
                            mb: 3,
                            '&:hover': {
                                background: `linear-gradient(-45deg, ${theme.palette.primary[400]}, ${theme.palette.accent.main})`,
                                color: theme.palette.common.white,
                                boxShadow: `0 4px 10px ${theme.palette.primary.main}33`,
                            },
                        }}
                        onClick={() => notify.info('Google registration coming soon')}
                    >
                        Sign up with Google
                    </Button>

                    <Typography variant="body2" align="center">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            style={{
                                fontWeight: 500,
                                color: theme.palette.primary.main,
                                textDecoration: 'none',
                            }}
                        >
                            Log in
                        </Link>
                    </Typography>
                </Box>
            </Container>
        </Container>
    );
};

export default Register;
