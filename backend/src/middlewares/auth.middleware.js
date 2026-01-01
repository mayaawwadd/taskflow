import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 1️⃣ Check header
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Authorization token missing',
            });
        }

        const token = authHeader.split(' ')[1];

        // 2️⃣ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3️⃣ Fetch user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: 'User not found',
            });
        }

        // 4️⃣ Attach user to request
        req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token',
        });
    }
};

export default authMiddleware;
