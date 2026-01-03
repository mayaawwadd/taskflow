import React from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { Layout, Users, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const Home = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: `linear-gradient(135deg, ${theme.palette.primary[50]} 0%, ${theme.palette.background.default} 40%, ${theme.palette.accent[50]} 100%)`,
            }}
        >
            {/* Main hero section */}
            <Container
                maxWidth="md"
                sx={{
                    textAlign: 'center',
                    py: { xs: 8, md: 10 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                }}
            >
                <Typography
                    variant="h2"
                    fontWeight={700}
                    sx={{
                        lineHeight: 1.2,
                        fontSize: { xs: '2.8rem', md: '3.5rem' },
                    }}
                >
                    Organize your work.
                    <br />
                    <Box
                        component="span"
                        sx={{
                            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.accent.main})`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Achieve more together.
                    </Box>
                </Typography>

                <Typography
                    variant="h6"
                    sx={{
                        color: theme.palette.text.secondary,
                        maxWidth: 700,
                        mx: 'auto',
                        // mt: 2,
                    }}
                >
                    TaskFlow brings all your tasks, teammates, and tools together. Keep
                    everything in the same place with boards, lists, and cards.
                </Typography>

                {/* Buttons */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        gap: 2,
                        justifyContent: 'center',
                        mt: 2,
                    }}
                >
                    <Button
                        size="large"
                        variant="contained"
                        sx={{
                            fontSize: '1rem',
                            px: 5,
                            textTransform: 'none',
                            borderRadius: 2,
                        }}
                        onClick={() => navigate('/auth')}
                    >
                        Start for free
                    </Button>

                    <Button
                        size="large"
                        variant="outlined"
                        sx={{
                            fontSize: '1rem',
                            px: 5,
                            textTransform: 'none',
                            borderRadius: 2,
                        }}
                    >
                        Learn more
                    </Button>
                </Box>
            </Container>

            {/* Features Section */}
            <Container maxWidth="lg" sx={{ py: 7 }}>
                <Grid container spacing={1} justifyContent="center">
                    <Grid
                        item
                        xs={12}
                        md={4}
                        textAlign="center"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                mx: 'auto',
                                mb: 2,
                                borderRadius: 2,
                                backgroundColor: theme.palette.primary[50],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Layout size={28} color={theme.palette.primary.main} />
                        </Box>
                        <Box sx={{ width: '80%' }}>
                            <Typography variant="h6" fontWeight={600}>
                                Boards
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: theme.palette.text.secondary, mt: 1 }}
                            >
                                Organize projects in flexible boards that fit your team's
                                workflow.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                        textAlign="center"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                mx: 'auto',
                                mb: 2,
                                borderRadius: 2,
                                backgroundColor: theme.palette.accent[50],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Users size={28} color={theme.palette.accent.main} />
                        </Box>
                        <Box sx={{ width: '80%' }}>
                            <Typography variant="h6" fontWeight={600}>
                                Collaborate
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: theme.palette.text.secondary, mt: 1 }}
                            >
                                Work together in real time with your team members.
                            </Typography>
                        </Box>
                    </Grid>

                    <Grid
                        item
                        xs={12}
                        md={4}
                        textAlign="center"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <Box
                            sx={{
                                width: 60,
                                height: 60,
                                mx: 'auto',
                                mb: 2,
                                borderRadius: 2,
                                backgroundColor: theme.palette.primary[50],
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Zap size={28} color={theme.palette.primary.main} />
                        </Box>
                        <Box sx={{ width: '80%' }}>
                            <Typography variant="h6" fontWeight={600}>
                                Fast & Simple
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: theme.palette.text.secondary, mt: 1 }}
                            >
                                Intuitive drag-and-drop interface for effortless task
                                management.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Home;