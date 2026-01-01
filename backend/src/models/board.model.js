import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema(
    {
        workspace: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        visibility: {
            type: String,
            enum: ['private', 'workspace'],
            required: true,
            default: 'workspace',
        },

        createdBy: {
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

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const Board = mongoose.model('Board', boardSchema);

export default Board;
