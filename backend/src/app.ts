import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import movieRoutes from './routes/movieRoutes';
import adminRoutes from './routes/adminRoutes';
import { login } from './controller/adminController';

const app = express();
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:8080';
app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.use('/api/movies', movieRoutes);
app.use('/api/admin', adminRoutes);

app.post('/api/login', login);

app.get('/', (req, res) => res.json({ message: 'Backend ready!' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

export default app;
