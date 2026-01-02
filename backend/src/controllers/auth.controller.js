import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { logActivity } from '../utils/activityLogger.js';

/* ================= REGISTER ================= */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: 'First name, last name, email, and password are required',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'Email already in use',
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            emailConfirmed: false,
            // avatar is automatically set by default
            // role defaults to "user"
            // lockout fields default automatically
        });

        await logActivity({
            actor: user._id,
            action: 'user_registered',
            entityType: 'user',
            entityId: user._id,
        });

        // Respond
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar || user.profileImage, // depending on naming
                role: user.role,
                emailConfirmed: user.emailConfirmed,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/* ================= LOGIN ================= */
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
            });
        }

        // Find user (include password)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        // Check lockout
        if (
            user.lockoutEnabled &&
            user.lockoutEnd &&
            user.lockoutEnd > new Date()
        ) {
            return res.status(403).json({
                message: 'Account is temporarily locked',
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        // Compare passwords
        if (!isMatch) {
            user.failedLoginAttempts += 1;

            if (
                user.lockoutEnabled &&
                user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS
            ) {
                user.lockoutEnd = new Date(
                    Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000
                );
                user.failedLoginAttempts = 0;
            }

            await user.save();

            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }


        // Reset failed attempts on success
        user.failedLoginAttempts = 0;
        user.lockoutEnd = null;
        await user.save();

        await logActivity({
            actor: user._id,
            action: 'user_logged_in',
            entityType: 'user',
            entityId: user._id,
        });

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Respond
        res.status(200).json({
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                avatar: user.avatar || user.profileImage,
                role: user.role,
                emailConfirmed: user.emailConfirmed,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMe = async (req, res) => {
    res.status(200).json({
        user: {
            id: req.user._id,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            avatar: req.user.avatar || req.user.profileImage,
            role: req.user.role,
            emailConfirmed: req.user.emailConfirmed,
        },
    });
};
