import { Card, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Board = ({ title, description, color = 'primary', onClick }) => {
    const theme = useTheme();

    return (
        <Card
            onClick={onClick}
            sx={{
                cursor: 'pointer',
                minHeight: 260,
                display: 'flex',
                flexDirection: 'column',
                transition: '0.25s ease',
                borderRadius: 2.7,
                '&:hover': {
                    opacity: 0.9,
                    boxShadow: `0 4px 10px ${theme.palette.primary.main}33`,
                },
                '&:focus': { outline: 'none' },
                '&:focus-visible': { outline: 'none' },
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    height: 140,
                    background: `linear-gradient(
            135deg,
            ${theme.palette[color]?.main || theme.palette.primary.main},
            ${theme.palette.accent.main}
          )`,
                }}
            />

            {/* Content */}
            <Box
                sx={{
                    px: 2,
                    py: 2,
                    height: 110,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: 0.5,
                }}
            >
                <Typography
                    fontWeight={600}
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {title}
                </Typography>

                {description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {description}
                    </Typography>
                )}
            </Box>
        </Card>
    );
};

export default Board;