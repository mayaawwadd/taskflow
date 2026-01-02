import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
    {
        list: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'List',
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: '',
        },

        startDate: {
            type: Date,
            default: null,
        },

        dueDate: {
            type: Date,
            default: null,
        },

        dueDateReminder: {
            type: String,
            enum: ['none', '1day', '1hour', '30min'],
            default: 'none',
        },

        order: {
            type: Number,
            required: true,
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
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

        deletedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null,
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

const Card = mongoose.model('Card', cardSchema);
export default Card;
