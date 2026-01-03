import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    TextField,
    Box,
    IconButton,
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import { useTheme } from '@mui/material/styles';
import { notify } from '../../utils/toast';

const CardDetailsDialog = ({
    open,
    card,
    onClose,
    onDelete,
    onUpdate,
}) => {
    const theme = useTheme();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');

    /* ---------- Sync card → local state ---------- */
    useEffect(() => {
        if (card) {
            setName(card.name || '');
            setIsEditing(false);
        }
    }, [card]);

    if (!card) return null;

    /* ---------- Handlers ---------- */
    const handleSave = async () => {
        if (!name.trim()) {
            notify.error('Card name cannot be empty');
            return;
        }

        try {
            await onUpdate(card.id, { name: name.trim() });
            notify.success('Card updated');
            setIsEditing(false);
        } catch {
            notify.error('Failed to update card');
        }
    };

    const handleDelete = async () => {
        try {
            await onDelete(card.id);
            notify.success('Card deleted');
            onClose();
        } catch {
            notify.error('Failed to delete card');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            {/* ---------- Header ---------- */}
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                }}
            >
                {isEditing ? (
                    <TextField
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="standard"
                        fullWidth
                        autoFocus
                        InputProps={{
                            sx: {
                                fontSize: 20,
                                fontWeight: 600,
                            },
                        }}
                    />
                ) : (
                    <Typography fontWeight={600} fontSize={18}>
                        {card.name}
                    </Typography>
                )}

                <IconButton
                    onClick={handleDelete}
                    sx={{
                        color: theme.palette.text.secondary,
                        '&:hover': {
                            color: theme.palette.error.main,
                        },
                    }}
                >
                    <Trash2 size={18} />
                </IconButton>
            </DialogTitle>

            {/* ---------- Content ---------- */}
            <DialogContent sx={{ py: 3 }}>
                <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Card name
                    </Typography>

                    {!isEditing && (
                        <Typography variant="body2" color="text.secondary">
                            Click <strong>Edit</strong> to rename this card.
                        </Typography>
                    )}
                </Box>
            </DialogContent>

            {/* ---------- Actions ---------- */}
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {isEditing ? (
                            <>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setName(card.name);
                                        setIsEditing(false);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="outlined"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit
                            </Button>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        onClick={onClose}
                        sx={{
                            background: `linear-gradient(-45deg, ${theme.palette.primary[400]}, ${theme.palette.accent.main})`,
                            textTransform: 'none',
                            fontWeight: 500,
                        }}
                    >
                        Close
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default CardDetailsDialog;
