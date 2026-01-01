import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/* ================= REGISTER ================= */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // 1️⃣ Validate input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({
                message: 'First name, last name, email, and password are required',
            });
        }

        // 2️⃣ Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'Email already in use',
            });
        }

        // 3️⃣ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4️⃣ Create user
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

        // 5️⃣ Respond
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

        // 4️⃣ Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Increment failed attempts
            user.failedLoginAttempts += 1;

            await user.save();

            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        // 5️⃣ Reset failed attempts on success
        user.failedLoginAttempts = 0;
        user.lockoutEnd = null;
        await user.save();

        // 6️⃣ Generate JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 7️⃣ Respond
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
