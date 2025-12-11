import { Router } from 'express';
import { login } from '../controller/adminController';

const router = Router();
router.post('/login', login);

export default router;

