import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'TaskFlow API',
    });
});
// Routes
app.use('/api/auth', authRoutes);

export default app;
