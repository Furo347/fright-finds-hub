import { Movie } from './index';

export type MovieDTO = {
  id?: number;
  title: string;
  director?: string;
  image_url?: string;
  rating?: number;
  year?: number;
  summary?: string;
};

export const getAllMovies = async (): Promise<MovieDTO[]> => {
  return (await Movie.findAll({ order: [['id', 'ASC']] })) as any;
};

export const createMovie = async (movie: MovieDTO): Promise<MovieDTO> => {
  const created = await Movie.create(movie as any);
  return created.toJSON() as MovieDTO;
};

export const deleteMovie = async (id: number): Promise<void> => {
  await Movie.destroy({ where: { id } });
};

export default { getAllMovies, createMovie, deleteMovie };
