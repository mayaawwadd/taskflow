import { Card, Typography, Box } from '@mui/material';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTheme } from '@mui/material/styles';

const KanbanCard = ({ card, onOpen }) => {
    const theme = useTheme();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: card.id,
        data: {
            type: 'CARD',
            card,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            onClick={(e) => {
                if (isDragging) return;
                e.stopPropagation();
                onOpen?.(card);
            }}
            sx={{
                p: 1.5,
                borderRadius: 2,
                backgroundColor: `${theme.palette.background.paper}E6`,
                backdropFilter: 'blur(6px)',
                border: `1px solid ${theme.palette.divider}`,
                boxShadow: isDragging
                    ? `0 8px 20px ${theme.palette.primary.main}33`
                    : theme.shadows[1],
                opacity: isDragging ? 0.85 : 1,
                transition:
                    'box-shadow 0.2s ease, transform 0.2s ease, background 0.2s ease',
                '&:hover': {
                    boxShadow: `0 6px 16px ${theme.palette.primary.main}22`,
                    backgroundColor: theme.palette.action.hover,
                },
            }}
        >
            {/* DRAG HANDLE */}
            <Box
                {...attributes}
                {...listeners}
                sx={{
                    cursor: 'grab',
                    '&:active': { cursor: 'grabbing' },
                }}
            >
                <Typography variant="body2" fontWeight={500}>
                    {card.name}
                </Typography>
            </Box>
        </Card>
    );
};

export default KanbanCard;
