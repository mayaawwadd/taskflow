import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    TextField,
    Box,
    Avatar,
    IconButton,
    MenuItem,
    Select,
    Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { UserPlus, X, Crown, Shield, User } from 'lucide-react';
import { notify } from '../../utils/toast';


const roleIcons = {
    owner: Crown,
    admin: Shield,
    member: User,
};

const roleLabels = {
    owner: 'Owner',
    admin: 'Admin',
    member: 'Member',
};

const ManageBoardMembersDialog = ({
    open,
    onClose,
    boardMembers,
    workspaceMembers,
    onAddMember,
    onRemoveMember,
    onUpdateRole,
}) => {
    const theme = useTheme();
    const [email, setEmail] = useState('');

    const handleAdd = () => {
        if (!email.trim()) return;

        const member = workspaceMembers.find(
            (m) => m.email.toLowerCase() === email.toLowerCase()
        );

        if (!member) {
            notify.error(
                "This user is not part of the workspace. Invite them to the workspace first."
            );
            setEmail('');
            return;
        };

        if (boardMembers.some((m) => m.id === member.id)) {
            notify.info("This member is already part of the board.");
            setEmail('');
            return;
        }

        onAddMember({ ...member, role: 'member' });
        setEmail('');
        notify.success("Member added to board");
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <UserPlus size={20} />
                Manage Board Members
            </DialogTitle>

            <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                height: 40, // match button height
                                borderRadius: 2,
                                fontSize: 14,
                                backgroundColor: theme.palette.background.paper,

                                '& fieldset': {
                                    borderColor: theme.palette.divider,
                                },

                                '&:hover fieldset': {
                                    borderColor: theme.palette.primary.main,
                                },

                                '&.Mui-focused fieldset': {
                                    borderColor: theme.palette.primary.main,
                                    borderWidth: 1.5,
                                },
                            },

                            '& input': {
                                padding: '0 14px', // vertical centering
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                            },
                        }}
                        placeholder="Enter email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        onClick={handleAdd}
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
                        }}>
                        Invite
                    </Button>
                </Box>

                {/* ---------- Members List ---------- */}
                <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Board Members ({boardMembers.length})
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {boardMembers.map((member) => {
                            const RoleIcon = roleIcons[member.role];

                            return (
                                <Box
                                    key={member.id}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 1.5,
                                        borderRadius: 2.5,

                                        backgroundColor: `${theme.palette.background.paper}CC`,
                                        backdropFilter: 'blur(6px)',

                                        border: `1px solid ${theme.palette.divider}`,
                                        transition: '0.25s ease',

                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            boxShadow: `0 4px 14px ${theme.palette.primary.main}22`,
                                        },
                                    }}
                                >
                                    {/* ---------- Left ---------- */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <Avatar
                                            sx={{
                                                bgcolor: member.avatarColor,
                                                width: 36,
                                                height: 36,
                                                fontSize: 14,
                                                fontWeight: 600,
                                            }}
                                        >
                                            {member.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                                .toUpperCase()}
                                        </Avatar>

                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {member.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {member.email}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {/* ---------- Right ---------- */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {member.role === 'owner' ? (
                                            <Chip
                                                icon={<RoleIcon size={14} />}
                                                label={roleLabels[member.role]}
                                                size="small"
                                                sx={{
                                                    fontWeight: 500,
                                                    background: `linear-gradient(-45deg, ${theme.palette.primary[300]}, ${theme.palette.accent.main})`,
                                                    color: theme.palette.text.white,
                                                    px: 0.5,
                                                    '& .MuiChip-icon': {
                                                        color: theme.palette.text.white,
                                                        marginLeft: '6px',

                                                    },
                                                }}
                                            />
                                        ) : (
                                            <>
                                                <Select
                                                    size="small"
                                                    value={member.role}
                                                    onChange={(e) =>
                                                        onUpdateRole(member.id, e.target.value)
                                                    }
                                                    sx={{
                                                        height: 32,
                                                        fontSize: 12,
                                                        borderRadius: 2,

                                                        '& .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: theme.palette.divider,
                                                        },

                                                        '&:hover .MuiOutlinedInput-notchedOutline': {
                                                            borderColor: theme.palette.primary.main,
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="admin">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <Shield size={14} style={{ marginRight: 6 }} />
                                                            Admin
                                                        </Box>
                                                    </MenuItem>
                                                    <MenuItem value="member">
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                            <User size={14} style={{ marginRight: 6 }} />
                                                            Member
                                                        </Box>
                                                    </MenuItem>
                                                </Select>

                                                <IconButton
                                                    size="small"
                                                    onClick={() => onRemoveMember(member.id)}
                                                    sx={{
                                                        color: 'text.secondary',
                                                        transition: '0.2s ease',
                                                        '&:hover': {
                                                            color: theme.palette.error.main,
                                                            backgroundColor: theme.palette.error.main + '14',
                                                        },
                                                    }}
                                                >
                                                    <X size={16} />
                                                </IconButton>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>

                </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2, }}>
                <Button
                    variant='contained'
                    sx={{
                        background: `linear-gradient(-45deg, ${theme.palette.primary[400]}, ${theme.palette.accent.main})`,
                        textTransform: 'none',
                        alignSelf: 'center',
                        fontWeight: 500,
                        borderRadius: 2,
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
                    onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ManageBoardMembersDialog;