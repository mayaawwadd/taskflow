import React, { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Card,
    CardContent,
} from '@mui/material';
import { Plus, Users } from 'lucide-react';
import { useParams } from 'react-router-dom';
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    SortableContext,
    horizontalListSortingStrategy,
    arrayMove,
} from '@dnd-kit/sortable';
import { useTheme } from '@mui/material/styles';

import KanbanList from '../components/List/KanbanList';
import KanbanCard from '../components/Card/KanbanCard';
import ListEmpty from '../components/List/ListEmpty';
import { notify } from '../utils/toast';

import { fetchWorkspaceMembers } from '../api/workspaceMembers';
import { fetchBoardById } from '../api/boards';
import {
    fetchBoardMembers,
    inviteBoardMember as inviteBoardMemberAPI,
    removeBoardMember as removeBoardMemberAPI,
    updateBoardMemberRole as updateBoardMemberRoleAPI,
} from '../api/boardMembers';
import { fetchListsByBoard, createList, reorderLists as reorderListsAPI } from '../api/lists';
import { fetchCardsByList, createCard, moveCard, deleteCard as deleteCardAPI, updateCard } from '../api/cards';
import ManageBoardMembersDialog from '../components/Board/ManageBoardMembersDialog';
import CardDetailsDialog from '../components/Card/CardDetailsDialog';


const BoardDetails = () => {
    const theme = useTheme();
    const { boardId, workspaceId } = useParams();

    /* ---------- Data State ---------- */
    const [loading, setLoading] = useState(true);
    const [board, setBoard] = useState(null);
    const [lists, setLists] = useState([]);

    /* ---------- UI State ---------- */
    const [activeCard, setActiveCard] = useState(null);
    const [activeList, setActiveList] = useState(null);

    const [activeListId, setActiveListId] = useState(null);

    const [isAddListOpen, setIsAddListOpen] = useState(false);
    const [newListTitle, setNewListTitle] = useState('');

    const [newCard, setNewCard] = useState({ title: '', description: '' });
    const [selectedCard, setSelectedCard] = useState(null);

    const [isBoardMembersOpen, setIsBoardMembersOpen] = useState(false);
    const [boardMembers, setBoardMembers] = useState([]);
    const [workspaceMembers, setWorkspaceMembers] = useState([]);


    /* ---------- Load board + lists + cards ---------- */
    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                /* ---------- Board ---------- */
                const boardData = await fetchBoardById(boardId);

                /* ---------- Lists + Cards ---------- */
                const listsData = await fetchListsByBoard(boardId);

                const listsWithCards = await Promise.all(
                    listsData.map(async (list) => {
                        const cards = await fetchCardsByList(list._id);

                        return {
                            ...list,
                            id: list._id,
                            title: list.name ?? list.title ?? 'Untitled',
                            cards: (cards || []).map((c) => ({
                                ...c,
                                id: c._id,                 // ✅ critical
                                name: c.name ?? c.title ?? '',
                                title: c.title ?? c.name ?? '',
                            })),
                        };
                    })
                );

                const members = await fetchBoardMembers(boardId);
                const workspaceMembersData = await fetchWorkspaceMembers(workspaceId);

                const normalizedWorkspaceMembers = workspaceMembersData.map((m) => ({
                    id: m.user._id,
                    name: `${m.user.firstName} ${m.user.lastName}`,
                    email: m.user.email,
                }));

                const normalizedMembers = members.map((m) => ({
                    id: m.user._id,
                    name: `${m.user.firstName} ${m.user.lastName}`,
                    email: m.user.email,
                    role: m.role,
                    avatarColor: '#64748b', // fallback, safe
                }));

                /* ---------- State Updates ---------- */
                setBoard(boardData);
                setLists(listsWithCards);
                setBoardMembers(normalizedMembers);
                setWorkspaceMembers(normalizedWorkspaceMembers);

            } catch (e) {
                notify.error('Failed to load board');
                setBoard(null);
                setLists([]);
                setBoardMembers([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [boardId]);


    const membersCount = useMemo(() => {
        return board?.members?.length || 0;
    }, [board]);

    /* ---------- Add List (backend) ---------- */
    const handleCreateList = async () => {
        if (!newListTitle.trim()) {
            notify.error('List title cannot be empty');
            return;
        }

        try {
            const created = await createList(boardId, { name: newListTitle.trim() });

            const normalized = {
                ...created,
                id: created._id,
                title: created.name ?? newListTitle.trim(),
                cards: [],
            };

            setLists((prev) => [...prev, normalized]);

            notify.success('List created');
            setNewListTitle('');
            setIsAddListOpen(false);
        } catch {
            notify.error('Failed to create list');
        }
    };

    /* ---------- Add Card (backend) ---------- */
    const handleCreateCard = async () => {
        if (!newCard.title.trim() || !activeListId) {
            notify.error('Card title is required');
            return;
        }

        try {
            const created = await createCard(activeListId, {
                name: newCard.title.trim(),
                // if your backend supports description, add it here:
                // description: newCard.description.trim(),
            });

            const normalized = {
                ...created,
                id: created._id,
                name: created.name ?? newCard.title.trim(),
                title: created.title ?? created.name ?? newCard.title.trim(),
            };

            setLists((prev) =>
                prev.map((l) =>
                    l.id === activeListId ? { ...l, cards: [...l.cards, normalized] } : l
                )
            );

            notify.success('Card added');
            setNewCard({ title: '', description: '' });
            setActiveListId(null);
        } catch {
            notify.error('Failed to create card');
        }
    };

    const handleDeleteCard = async (cardId) => {
        try {
            await deleteCardAPI(cardId);

            // Remove card from all lists
            setLists((prev) =>
                prev.map((list) => ({
                    ...list,
                    cards: list.cards.filter((c) => c.id !== cardId),
                }))
            );

        } catch (error) {
            notify.error(error.response?.data?.message || 'Failed to delete card');
            throw error; // lets dialog know it failed
        }
    };

    const handleUpdateCard = async (cardId, payload) => {
        try {
            const updated = await updateCard(cardId, payload);

            // Update card name in state
            setLists((prev) =>
                prev.map((list) => ({
                    ...list,
                    cards: list.cards.map((c) =>
                        c.id === cardId
                            ? {
                                ...c,
                                name: updated.name,
                                title: updated.name, // keep compatibility
                            }
                            : c
                    ),
                }))
            );

            // Also update the selected card so dialog stays in sync
            setSelectedCard((prev) =>
                prev ? { ...prev, name: updated.name } : prev
            );
        } catch (error) {
            notify.error(error.response?.data?.message || 'Failed to update card');
            throw error;
        }
    };


    /* ---------- DND ---------- */
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
    );

    const handleDragStart = ({ active }) => {
        // LIST?
        const list = lists.find((l) => l.id === active.id);
        if (list) {
            setActiveList(list);
            setActiveCard(null);
            return;
        }

        // CARD?
        const card = lists.flatMap((l) => l.cards).find((c) => c.id === active.id);
        setActiveCard(card || null);
        setActiveList(null);
    };

    const handleDragEnd = async ({ active, over }) => {
        setActiveCard(null);
        setActiveList(null);

        if (!over || active.id === over.id) return;

        /* ---------- LIST REORDER (UI only unless you add an API) ---------- */
        const fromListIndex = lists.findIndex((l) => l.id === active.id);
        const toListIndex = lists.findIndex((l) => l.id === over.id);

        if (fromListIndex !== -1 && toListIndex !== -1) {
            const updatedLists = arrayMove(lists, fromListIndex, toListIndex);

            // Optimistic UI update
            setLists(updatedLists);

            // Build payload for backend
            const orderedListIds = updatedLists.map((l) => l.id);

            try {
                await reorderListsAPI(boardId, orderedListIds);
            } catch (error) {
                notify.error('Failed to reorder lists');

                // Optional rollback (recommended)
                setLists(lists);
            }

            return;
        }

        /* ---------- CARD MOVE (backend) ---------- */
        let sourceList;
        let targetList;
        let draggedCard;

        for (const list of lists) {
            const found = list.cards.find((c) => c.id === active.id);
            if (found) {
                sourceList = list;
                draggedCard = found;
                break;
            }
        }

        if (!sourceList || !draggedCard) return;

        targetList =
            lists.find((l) => l.id === over.id) ||
            lists.find((l) => l.cards.some((c) => c.id === over.id));

        if (!targetList) return;

        const sourceIndex = sourceList.cards.findIndex((c) => c.id === draggedCard.id);
        const targetIndex = targetList.cards.findIndex((c) => c.id === over.id);

        // same-list reorder
        if (sourceList.id === targetList.id) {
            const newCards = arrayMove(
                sourceList.cards,
                sourceIndex,
                targetIndex === -1 ? sourceList.cards.length - 1 : targetIndex
            );

            // optimistic UI update
            setLists((prev) =>
                prev.map((l) => (l.id === sourceList.id ? { ...l, cards: newCards } : l))
            );

            // persist: moveCard expects { listId, order }
            // order is 1-based
            const newOrder = (targetIndex === -1 ? newCards.length : targetIndex + 1);

            try {
                await moveCard(draggedCard.id, {
                    listId: targetList.id,
                    order: newOrder,
                });
            } catch {
                notify.error('Failed to move card');
                // (optional) reload board here if you want strict consistency
            }

            return;
        }

        // cross-list move
        const insertIndex = targetIndex === -1 ? targetList.cards.length : targetIndex;

        // optimistic UI update
        setLists((prev) =>
            prev.map((l) => {
                if (l.id === sourceList.id) {
                    return { ...l, cards: l.cards.filter((c) => c.id !== draggedCard.id) };
                }

                if (l.id === targetList.id) {
                    const newCards = [...l.cards];
                    newCards.splice(insertIndex, 0, { ...draggedCard, listId: l.id });
                    return { ...l, cards: newCards };
                }

                return l;
            })
        );

        try {
            await moveCard(draggedCard.id, {
                listId: targetList.id,
                order: insertIndex + 1, // 1-based
            });
        } catch {
            notify.error('Failed to move card');
            // (optional) reload board here
        }
    };

    /* ---------- Render ---------- */
    if (loading) {
        return (
            <Box sx={{ p: 6 }}>
                <Typography>Loading board...</Typography>
            </Box>
        );
    }

    if (!board) {
        return (
            <Box sx={{ p: 6 }}>
                <Typography variant="h6">Board not found</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', background: theme.palette.background.default }}
        >
            <Container maxWidth="xl" sx={{ py: 5 }}>
                {/* ---------- Header ---------- */}
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
                            {board.title}
                        </Typography>
                        {board.description && (
                            <Typography color="text.secondary">
                                {board.description}
                            </Typography>
                        )}
                    </Box>

                    <Button
                        startIcon={<Users size={18} />}
                        variant="contained"
                        onClick={() => setIsBoardMembersOpen(true)}
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
                        Members ({membersCount})
                    </Button>

                </Box>

                {/* ---------- Kanban Board ---------- */}
                {lists.length === 0 ? (
                    <ListEmpty onCreate={() => setIsAddListOpen(true)} />
                ) : (
                    <DndContext
                        sensors={sensors}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                gap: 2,
                                overflowX: 'auto',
                                pb: 2,
                                alignItems: 'flex-start',
                                '&::-webkit-scrollbar': { height: 8 },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: theme.palette.divider,
                                    borderRadius: 4,
                                },
                            }}
                        >
                            <SortableContext
                                items={lists.map((l) => l.id)}
                                strategy={horizontalListSortingStrategy}
                            >
                                {lists.map((list) => (
                                    <KanbanList
                                        key={list.id}
                                        list={list}
                                        onAddCard={(listId) => setActiveListId(listId)}
                                        onOpenCard={(card) => setSelectedCard(card)}
                                    />
                                ))}
                            </SortableContext>

                            {/* Create List Card */}
                            <Card
                                onClick={() => setIsAddListOpen(true)}
                                sx={{
                                    minWidth: 280,
                                    minHeight: 204.19,
                                    border: `2px dashed ${theme.palette.divider}`,
                                    borderRadius: 2.7,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    flexShrink: 0,
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
                                    <Plus size={32} />
                                    <Typography fontWeight={500}>Create new list</Typography>
                                </CardContent>
                            </Card>
                        </Box>

                        <DragOverlay>
                            {activeCard ? <KanbanCard card={activeCard} isDragging /> : null}
                            {activeList ? <KanbanList list={activeList} /> : null}
                        </DragOverlay>
                    </DndContext>
                )}
            </Container>

            {/* ---------- Add List Dialog ---------- */}
            <Dialog
                open={isAddListOpen}
                onClose={() => setIsAddListOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add New List</DialogTitle>

                <DialogContent>
                    <TextField
                        label="List title"
                        fullWidth
                        autoFocus
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                    />
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setIsAddListOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        type="submit"
                        onClick={handleCreateList}
                        disabled={!newListTitle.trim()}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* ---------- Add Card Dialog ---------- */}
            <Dialog
                open={Boolean(activeListId)}
                onClose={() => setActiveListId(null)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Add Card</DialogTitle>

                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Title"
                        autoFocus
                        value={newCard.title}
                        onChange={(e) =>
                            setNewCard((prev) => ({ ...prev, title: e.target.value }))
                        }
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={3}
                        value={newCard.description}
                        onChange={(e) =>
                            setNewCard((prev) => ({ ...prev, description: e.target.value }))
                        }
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setActiveListId(null)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleCreateCard}
                        disabled={!newCard.title.trim()}
                    >
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            <ManageBoardMembersDialog
                open={isBoardMembersOpen}
                onClose={() => setIsBoardMembersOpen(false)}
                boardMembers={boardMembers}
                workspaceMembers={workspaceMembers}

                onAddMember={async (member) => {
                    try {
                        const created = await inviteBoardMemberAPI(
                            boardId,
                            member.email,
                            member.role
                        );

                        setBoardMembers((prev) => [
                            ...prev,
                            {
                                id: created.user, // backend user id
                                name: member.name,
                                email: member.email,
                                role: created.role,
                                avatarColor: '#64748b',
                            },
                        ]);

                        notify.success('Member added to board');
                    } catch (err) {
                        notify.error(err.response?.data?.message || 'Failed to add member');
                    }
                }}

                onRemoveMember={async (memberId) => {
                    try {
                        await removeBoardMemberAPI(boardId, memberId);

                        setBoardMembers((prev) =>
                            prev.filter((m) => m.id !== memberId)
                        );

                        notify.success('Member removed');
                    } catch (err) {
                        notify.error(err.response?.data?.message || 'Failed to remove member');
                    }
                }}

                onUpdateRole={async (memberId, role) => {
                    try {
                        await updateBoardMemberRoleAPI(boardId, memberId, role);

                        setBoardMembers((prev) =>
                            prev.map((m) =>
                                m.id === memberId ? { ...m, role } : m
                            )
                        );

                        notify.success('Role updated');
                    } catch (err) {
                        notify.error(err.response?.data?.message || 'Failed to update role');
                    }
                }}
            />

            <CardDetailsDialog
                open={Boolean(selectedCard)}
                card={selectedCard}
                onClose={() => setSelectedCard(null)}
                onDelete={handleDeleteCard}
                onUpdate={handleUpdateCard}
            />
        </Box>
    );
};

export default BoardDetails;
