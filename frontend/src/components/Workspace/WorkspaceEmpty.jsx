import { Box, Typography, Button } from '@mui/material';
import { Plus } from 'lucide-react';
import { useTheme } from '@mui/material/styles';


const WorkspaceEmpty = ({ onCreate }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                minHeight: 360,
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                gap: 2,
                backgroundColor: 'background.paper',
            }}
        >
            <Box
                sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    backgroundColor: 'primary.50',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Plus size={28} />
            </Box>

            <Typography variant="h6" fontWeight={600}>
                No workspaces yet
            </Typography>

            <Typography color="text.secondary" sx={{ maxWidth: 360 }}>
                Create your first workspace to organize boards, projects, and tasks.
            </Typography>

            <Button
                startIcon={<Plus size={18} />}
                onClick={onCreate}
                variant="contained"
                sx={{
                    background: `linear-gradient(-45deg, ${theme.palette.primary[400]}, ${theme.palette.accent.main})`,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 2,
                    py: 0.7,
                    transition: '0.3s ease-in-out',
                    '&:hover': {
                        opacity: 0.9,
                        color: theme.palette.text.white,
                        boxShadow: `0 4px 10px ${theme.palette.primary.main}33`, // subtle glow
                    },
                    '&:focus': { outline: 'none' },
                    '&:focus-visible': { outline: 'none' },
                }}
            >
                Create Workspace
            </Button>
        </Box>
    );
};

export default WorkspaceEmpty;