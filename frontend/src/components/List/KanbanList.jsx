import { Box, Typography, Card, Button } from '@mui/material';
import { Plus } from 'lucide-react';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import KanbanCard from '../Card/KanbanCard';
import { useTheme } from '@mui/material/styles';

const KanbanList = ({ list, onAddCard, onOpenCard }) => {
    const theme = useTheme();

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isOver,
    } = useSortable({
        id: list.id,
        data: {
            type: 'LIST',
            list,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const cardIds = list.cards.map((c) => c.id);

    return (
        <Box sx={{ minWidth: 280 }}>
            <Card
                ref={setNodeRef}
                style={style}
                sx={{
                    minWidth: 280,
                    p: 2,
                    borderRadius: 2.5,
                    backgroundColor: `${theme.palette.background.paper}CC`,
                    backdropFilter: 'blur(8px)',
                    border: `1px solid ${isOver ? theme.palette.primary.main : theme.palette.divider
                        }`,
                    boxShadow: theme.shadows[1],
                }}
            >
                {/* LIST HEADER (drag handle) */}
                <Box
                    {...attributes}
                    {...listeners}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        cursor: 'grab',
                        '&:active': { cursor: 'grabbing' },
                    }}
                >
                    <Typography fontWeight={600}>
                        {list.title}
                    </Typography>
                </Box>

                {/* CARDS */}
                <SortableContext
                    items={cardIds}
                    strategy={verticalListSortingStrategy}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            minHeight: 80,
                            borderRadius: 1.5,
                            border:
                                list.cards.length === 0
                                    ? `2px dashed ${theme.palette.divider}`
                                    : 'none',
                            justifyContent:
                                list.cards.length === 0
                                    ? 'center'
                                    : 'flex-start',
                            alignItems:
                                list.cards.length === 0
                                    ? 'center'
                                    : 'stretch',
                            color: theme.palette.text.secondary,
                            fontSize: 13,
                        }}
                    >
                        {list.cards.length === 0 ? (
                            <span>Drop cards here</span>
                        ) : (
                            list.cards.map((card) => (
                                <KanbanCard
                                    key={card.id}
                                    card={card}
                                    onOpen={onOpenCard}
                                />
                            ))
                        )}
                    </Box>
                </SortableContext>

                {/* ADD CARD */}
                <Button
                    startIcon={<Plus size={13} />}
                    onClick={() => onAddCard(list.id)}
                    variant="outlined"
                    sx={{
                        width: '100%',
                        mt: 1,
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: 12,
                        borderRadius: 2,
                        color: theme.palette.text.primary,
                        borderColor: theme.palette.divider,
                        '&:hover': {
                            background: theme.palette.action.hover,
                        },
                    }}
                >
                    Add card
                </Button>
            </Card>
        </Box>
    );
};

export default KanbanList;
