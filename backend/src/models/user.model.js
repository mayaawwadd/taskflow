import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        emailConfirmed: {
            type: Boolean,
            default: false,
        },

        firstName: {
            type: String,
            required: true,
            trim: true,
        },

        lastName: {
            type: String,
            required: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        avatar: {
            type: String,
            default: '/uploads/avatars/default.png',
        },

        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },

        lockoutEnd: {
            type: Date,
            default: null,
        },

        failedLoginAttempts: {
            type: Number,
            default: 0,
        },

        lockoutEnabled: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('User', userSchema);

export default User;
