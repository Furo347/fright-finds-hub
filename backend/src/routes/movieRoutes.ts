import { Router } from 'express';
import { listMovies, addMovie, removeMovie } from '../controller/movieController';
import auth from '../middleware/auth';

const router = Router();

router.get('/', listMovies);
router.post('/', auth, addMovie);
router.delete('/:id', auth, removeMovie);

export default router;

