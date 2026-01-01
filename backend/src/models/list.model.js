import mongoose from 'mongoose';

const listSchema = new mongoose.Schema(
    {
        board: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Board',
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        order: {
            type: Number,
            required: true,
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
        timestamps: true, // createdAt, updatedAt
    }
);

const List = mongoose.model('List', listSchema);
export default List;
