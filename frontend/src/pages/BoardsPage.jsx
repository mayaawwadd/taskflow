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
import { Plus, Users } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import Board from '../components/Board/Board';
import BoardEmpty from '../components/Board/BoardEmpty';
import ManageMembersDialog from '../components/Workspace/ManageMembersDialog';
import { notify } from '../utils/toast';

import { fetchBoardsByWorkspace, createBoard } from '../api/boards';
import {
    fetchWorkspaceMembers,
    inviteWorkspaceMember,
    removeWorkspaceMember,
    updateWorkspaceMemberRole,
} from '../api/workspaceMembers';
import { fetchWorkspaces } from '../api/workspaces';

const BoardsPage = () => {
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const [workspace, setWorkspace] = useState(null);
    const [boards, setBoards] = useState([]);
    const [members, setMembers] = useState([]);

    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [membersOpen, setMembersOpen] = useState(false);

    const [newBoard, setNewBoard] = useState({
        title: '',
        description: '',
    });

    /* ================= FETCH DATA ================= */

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);

                // Workspace info
                const workspaces = await fetchWorkspaces();
                const current = workspaces.find((w) => w._id === workspaceId);

                if (!current) {
                    notify.error('Workspace not found');
                    return;
                }

                setWorkspace(current);

                // Boards
                const boardsData = await fetchBoardsByWorkspace(workspaceId);
                setBoards(boardsData);

                // Members
                const membersData = await fetchWorkspaceMembers(workspaceId);
                setMembers(
                    membersData.map((m) => ({
                        id: m.user._id,
                        name: `${m.user.firstName} ${m.user.lastName}`,
                        email: m.user.email,
                        role: m.role,
                        avatarColor: theme.palette.primary.main,
                    }))
                );
            } catch (error) {
                notify.error('Failed to load workspace data');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [workspaceId, theme.palette.primary.main]);

    /* ================= CREATE BOARD ================= */

    const handleCreateBoard = async () => {
        if (!newBoard.title.trim()) {
            notify.error('Board title is required');
            return;
        }

        try {
            const board = await createBoard(workspaceId, newBoard);
            setBoards((prev) => [board, ...prev]);
            notify.success('Board created successfully');
            setNewBoard({ title: '', description: '' });
            setOpen(false);
        } catch {
            notify.error('Failed to create board');
        }
    };

    if (loading) {
        return (
            <Box sx={{ p: 6 }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (!workspace) {
        return (
            <Box sx={{ p: 6 }}>
                <Typography variant="h5">Workspace not found</Typography>
            </Box>
        );
    }

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
                            {workspace.name}
                        </Typography>
                        <Typography color="text.secondary">
                            {workspace.description || 'Boards in this workspace'}
                        </Typography>
                    </Box>

                    <Button
                        startIcon={<Users size={18} />}
                        onClick={() => setMembersOpen(true)}
                        variant="contained"
                        sx={{
                            background: `linear-gradient(-45deg, ${theme.palette.primary[400]}, ${theme.palette.accent.main})`,
                            textTransform: 'none',
                            fontWeight: 500,
                            alignSelf: 'center',
                            borderRadius: 2,
                            px: 2,
                            py: 0.7,
                            transition: '0.3s ease-in-out',
                            '&:hover': {
                                opacity: 0.9,
                                boxShadow: `0 4px 10px ${theme.palette.primary.main}33`,
                            },
                        }}
                    >
                        Members ({members.length})
                    </Button>
                </Box>

                {/* Boards */}
                {boards.length === 0 ? (
                    <BoardEmpty onCreate={() => setOpen(true)} />
                ) : (
                    <Grid container spacing={4}>
                        {boards.map((board) => (
                            <Grid key={board._id} item size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                                <Board
                                    title={board.title}
                                    description={board.description}
                                    color="primary"
                                    onClick={() => navigate(`/boards/${board._id}`)}
                                />
                            </Grid>
                        ))}

                        {/* Create Board Card */}
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
                                    '&:hover': {
                                        borderColor: theme.palette.primary.main,
                                        backgroundColor: theme.palette.primary[50],
                                    },
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <Plus size={32} />
                                    <Typography fontWeight={500}>Create new board</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Container>

            {/* Create Board Dialog */}
            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Create New Board</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Board Title"
                        value={newBoard.title}
                        onChange={(e) =>
                            setNewBoard((prev) => ({ ...prev, title: e.target.value }))
                        }
                        required
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={3}
                        value={newBoard.description}
                        onChange={(e) =>
                            setNewBoard((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateBoard}
                        disabled={!newBoard.title}
                    >
                        Create Board
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Members Dialog */}
            <ManageMembersDialog
                open={membersOpen}
                onClose={() => setMembersOpen(false)}
                members={members}
                onAddMember={async (email) => {
                    try {
                        await inviteWorkspaceMember(workspaceId, email);

                        notify.success('Member invited successfully');

                        const updated = await fetchWorkspaceMembers(workspaceId);
                        setMembers(
                            updated.map((m) => ({
                                id: m.user._id,
                                name: `${m.user.firstName} ${m.user.lastName}`,
                                email: m.user.email,
                                role: m.role,
                                avatarColor: theme.palette.primary.main,
                            }))
                        );

                        return true;
                    } catch (err) {
                        notify.error(
                            err.response?.data?.message || 'Failed to invite member'
                        );
                        return false;
                    }
                }}

                onRemoveMember={async (userId) => {
                    try {
                        await removeWorkspaceMember(workspaceId, userId);
                        setMembers((prev) => prev.filter((m) => m.id !== userId));
                        notify.success('Member removed');
                    } catch (err) {
                        notify.error('Failed to remove member');
                    }
                }}

                onUpdateRole={async (userId, role) => {
                    try {
                        await updateWorkspaceMemberRole(workspaceId, userId, role);
                        setMembers((prev) =>
                            prev.map((m) =>
                                m.id === userId ? { ...m, role } : m
                            )
                        );
                        notify.success('Role updated');
                    } catch (err) {
                        notify.error(
                            err.response?.data?.message || 'Failed to update role'
                        );
                    }
                }}
            />

        </Box>
    );
};

export default BoardsPage;
