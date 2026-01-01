import mongoose from 'mongoose';

const boardMemberSchema = new mongoose.Schema(
    {
        board: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Board',
            required: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        role: {
            type: String,
            enum: ['owner', 'admin', 'member', 'viewer'],
            required: true,
            default: 'member',
        },

        joinedAt: {
            type: Date,
            required: true,
            default: Date.now,
        },

        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },

        isDeleted: {
            type: Boolean,
            required: true,
            default: false,
        },

        removedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

/* Prevent duplicate membership */
boardMemberSchema.index(
    { board: 1, user: 1 },
    { unique: true }
);

const BoardMember = mongoose.model('BoardMember', boardMemberSchema);
export default BoardMember;
