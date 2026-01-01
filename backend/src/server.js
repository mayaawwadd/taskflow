import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 8000;


/* ---------- MongoDB Connection ---------- */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

connectDB();

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
