import { Request, Response } from 'express';
import { getAllMovies, createMovie, deleteMovie } from '../models/movieModel';

export const listMovies = async (req: Request, res: Response) => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const addMovie = async (req: Request, res: Response) => {
  try {
    const movie = await createMovie(req.body);
    res.status(201).json(movie);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const removeMovie = async (req: Request, res: Response) => {
  try {
    await deleteMovie(Number(req.params.id));
    res.json({ message: 'Movie deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

