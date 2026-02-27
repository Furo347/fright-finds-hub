import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import heroImage from "@/assets/hero-horror.jpg";
import alienImage from "@/assets/alien.jpg";
import peurImage from "@/assets/peur.jpg";

interface Movie {
  id?: number;
  title: string;
  year: number;
  director: string;
  rating: number;
  genre: string;
  synopsis: string;
  imageUrl: string;
}

const API_BASE = (import.meta.env.VITE_API_BASE || "").replace(/\/$/, "");
const API_MOVIES = `${API_BASE}/api/movies`;
type MovieApi = Partial<Movie> & {
  id?: number;
  summary?: string;
  image_url?: string;
};

const Index: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<Movie>({
    title: "",
    year: 2000,
    director: "",
    rating: 5,
    genre: "",
    synopsis: "",
    imageUrl: alienImage,
  });
  const queryClient = useQueryClient();
  const { isAdmin, authHeaders } = useAuth();

  const {
    data: movies,
    isLoading,
    isError,
  } = useQuery<MovieApi[]>({
    queryKey: ["movies"],
    queryFn: async () => {
      const res = await fetch(API_MOVIES);
      if (!res.ok) throw new Error("Failed to fetch movies");
      return (await res.json()) as Movie[];
    },
  });

  const createMovie = useMutation({
    mutationFn: async (payload: Movie) => {
      const res = await fetch(API_MOVIES, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create movie");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movies"] });
      setFormData({
        title: "",
        year: 2000,
        director: "",
        rating: 5,
        genre: "",
        synopsis: "",
        imageUrl: alienImage,
      });
    },
  });

  const deleteMovie = useMutation({
    mutationFn: async (id?: number) => {
      if (!id) throw new Error("Missing id");
      const res = await fetch(`${API_MOVIES}/${id}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["movies"] }),
  });

  const resolveImageUrl = (url?: string): string => {
    if (!url) return peurImage;
    if (url.startsWith("http")) return url;
    // Chemin relatif type "/assets/shining.jpg" → utilise l'image importée correspondante
    return peurImage;
  };

  const mapMovie = (movie: MovieApi): Movie => ({
    id: movie.id,
    title: movie.title ?? "Titre inconnu",
    director: movie.director ?? "Réalisateur inconnu",
    year: movie.year ?? 0,
    rating: movie.rating ?? 0,
    genre: movie.genre ?? "Horreur",
    synopsis:
      movie.synopsis ?? movie.summary ?? "Synopsis indisponible pour ce film.",
    imageUrl: resolveImageUrl(movie.imageUrl ?? movie.image_url),
  });

  const normalizedMovies = useMemo(
    () => (movies ?? []).map(mapMovie),
    [movies],
  );

  const filteredMovies = useMemo(() => {
    const list = normalizedMovies;
    const q = searchQuery.toLowerCase();
    return list.filter(
      (movie) =>
        movie.title.toLowerCase().includes(q) ||
        movie.director.toLowerCase().includes(q) ||
        movie.genre.toLowerCase().includes(q),
    );
  }, [normalizedMovies, searchQuery]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]:
        id === "year" || id === "rating" ? Number(value) : (value as string),
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) return alert("Le titre est obligatoire");
    createMovie.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-foreground drop-shadow-[0_0_20px_rgba(139,0,0,0.8)]">
            Films d'Horreur
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 drop-shadow-lg">
            Les classiques qui ont défini le genre
          </p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Rechercher un film, réalisateur, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-card/80 backdrop-blur border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="h-6 mb-6" />

        {isAdmin && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <Input
              id="title"
              placeholder="Titre"
              value={formData.title}
              onChange={handleInputChange}
            />
            <Input
              id="year"
              type="number"
              placeholder="Année"
              value={formData.year}
              onChange={handleInputChange}
            />
            <Input
              id="director"
              placeholder="Réalisateur"
              value={formData.director}
              onChange={handleInputChange}
            />
            <Input
              id="rating"
              type="number"
              step="0.1"
              placeholder="Note (0-10)"
              value={formData.rating}
              onChange={handleInputChange}
            />
            <Input
              id="genre"
              placeholder="Genre"
              value={formData.genre}
              onChange={handleInputChange}
            />
            <Input
              id="synopsis"
              placeholder="Synopsis"
              value={formData.synopsis}
              onChange={handleInputChange}
            />
            <Input
              id="imageUrl"
              placeholder="Image URL"
              value={formData.imageUrl}
              onChange={handleInputChange}
            />

            <button
              className="h-10 rounded bg-primary text-primary-foreground px-4 hover:bg-primary/90"
              onClick={handleSubmit}
              disabled={createMovie.isPending}
            >
              {createMovie.isPending ? "Ajout..." : "Ajouter le film"}
            </button>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              Chargement des films…
            </p>
          </div>
        )}

        {isError && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              Erreur lors du chargement des films
            </p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id || movie.title}
                {...movie}
                onDelete={isAdmin ? (id) => deleteMovie.mutate(id) : undefined}
              />
            ))}
          </div>
        )}

        {!isLoading && !isError && filteredMovies.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              Aucun film ne correspond à votre recherche
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
