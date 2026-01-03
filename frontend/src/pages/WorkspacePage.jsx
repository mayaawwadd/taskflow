import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import Workspace from '../components/Workspace/Workspace';
import WorkspaceEmpty from '../components/Workspace/WorkspaceEmpty';
import { notify } from '../utils/toast';
import { fetchWorkspaces, createWorkspace } from '../api/workspaces';

const WorkspacePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();

    const [workspaces, setWorkspaces] = useState([]);
    const [loading, setLoading] = useState(true);

    const [open, setOpen] = useState(false);
    const [newWorkspace, setNewWorkspace] = useState({
        title: '',
        description: '',
    });

    /* ================= LOAD WORKSPACES ================= */
    useEffect(() => {
        const loadWorkspaces = async () => {
            try {
                const data = await fetchWorkspaces();
                setWorkspaces(data);
            } catch (error) {
                notify.error('Failed to load workspaces');
            } finally {
                setLoading(false);
            }
        };

        loadWorkspaces();
    }, []);

    /* ================= CREATE WORKSPACE ================= */
    const handleCreateWorkspace = async () => {
        if (!newWorkspace.title.trim()) {
            notify.error('Workspace title is required');
            return;
        }

        try {
            const workspace = await createWorkspace({
                name: newWorkspace.title,
                description: newWorkspace.description,
            });

            setWorkspaces((prev) => [...prev, workspace]);
            notify.success('Workspace created successfully');

            setNewWorkspace({ title: '', description: '' });
            setOpen(false);
        } catch (error) {
            notify.error('Failed to create workspace');
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}>
            <Container maxWidth="xl" sx={{ py: 5 }}>
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 4,
                    }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={700}>
                            My Workspaces
                        </Typography>
                        <Typography color="text.secondary">
                            Manage your workspaces
                        </Typography>
                    </Box>

                    <Button
                        startIcon={<Plus size={18} />}
                        onClick={() => setOpen(true)}
                        variant="contained"
                        sx={{
                            background: `linear-gradient(-45deg, ${theme.palette.primary[400]}, ${theme.palette.accent.main})`,
                            textTransform: 'none',
                            fontWeight: 500,
                            borderRadius: 2,
                            alignSelf: 'center',
                            px: 2,
                            py: 0.7,
                            transition: '0.3s ease-in-out',
                            '&:hover': {
                                opacity: 0.9,
                                boxShadow: `0 4px 10px ${theme.palette.primary.main}33`,
                            },
                            '&:focus': { outline: 'none' },
                            '&:focus-visible': { outline: 'none' },
                        }}
                    >
                        Create Workspace
                    </Button>
                </Box>

                {/* Workspaces Grid */}
                {loading ? (
                    <Typography color="text.secondary">Loading workspaces...</Typography>
                ) : workspaces.length === 0 ? (
                    <WorkspaceEmpty onCreate={() => setOpen(true)} />
                ) : (
                    <Grid container spacing={4}>
                        {workspaces.map((workspace, index) => {
                            const colors = ['blue', 'purple', 'orange', 'green', 'indigo'];
                            const color = colors[index % colors.length];

                            return (
                                <Grid
                                    item
                                    size={{ xs: 12, sm: 6, md: 4, lg: 3 }}
                                    key={workspace._id}
                                >
                                    <Workspace
                                        title={workspace.name}
                                        description={workspace.description}
                                        color={color}
                                        onClick={() =>
                                            navigate(`/workspaces/${workspace._id}`)
                                        }
                                    />
                                </Grid>
                            );
                        })}

                        {/* Create Workspace Card */}
                        <Grid item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <Card
                                onClick={() => setOpen(true)}
                                sx={{
                                    minHeight: 260,
                                    border: `2px dashed ${theme.palette.divider}`,
                                    display: 'flex',
                                    borderRadius: 2.7,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    transition: '0.25s ease',
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        backgroundColor: theme.palette.primary[50],
                                    },
                                }}
                            >
                                <CardContent
                                    sx={{
                                        textAlign: 'center',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        gap: 1,
                                    }}
                                >
                                    <Plus size={36} />
                                    <Typography fontWeight={500}>
                                        Create new workspace
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Container>

            {/* Create Workspace Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Workspace Title"
                        value={newWorkspace.title}
                        onChange={(e) =>
                            setNewWorkspace({ ...newWorkspace, title: e.target.value })
                        }
                        required
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={3}
                        value={newWorkspace.description}
                        onChange={(e) =>
                            setNewWorkspace({
                                ...newWorkspace,
                                description: e.target.value,
                            })
                        }
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateWorkspace}
                        disabled={!newWorkspace.title}
                    >
                        Create Workspace
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default WorkspacePage;
