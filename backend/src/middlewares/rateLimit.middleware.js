import rateLimit from 'express-rate-limit';

export const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // per IP
    message: {
        message: 'Too many login attempts, please try again later',
    },
});
