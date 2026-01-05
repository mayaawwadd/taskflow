import {
    Drawer,
    Box,
    Typography,
    Avatar,
    Divider,
} from '@mui/material';

const ActivityDrawer = ({ open, onClose, activity = [] }) => {
    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 360, p: 3 }}>
                <Typography variant="h6" fontWeight={600} mb={2}>
                    Activity
                </Typography>

                {activity.length === 0 ? (
                    <Typography color="text.secondary">
                        No recent activity
                    </Typography>
                ) : (
                    activity.map((item) => {
                        const actorName = item.actor
                            ? `${item.actor.firstName} ${item.actor.lastName}`
                            : 'System';

                        const actorInitial = actorName.charAt(0);

                        return (
                            <Box key={item.id} sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <Avatar
                                        src={item.actor?.avatar || undefined}
                                        sx={{ width: 32, height: 32 }}
                                    >
                                        {actorInitial}
                                    </Avatar>

                                    <Box>
                                        <Typography variant="body2">
                                            {item.message}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                        >
                                            {new Date(item.createdAt).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mt: 2 }} />
                            </Box>
                        );
                    })
                )}
            </Box>
        </Drawer>
    );
};

export default ActivityDrawer;
