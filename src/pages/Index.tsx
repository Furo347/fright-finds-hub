import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import heroImage from "@/assets/hero-horror.jpg";


const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: movies, isLoading, isError } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const res = await fetch("/api/movies");
      if (!res.ok) throw new Error("Failed to fetch movies");
      return (await res.json()) as Array<{
        id?: number;
        title: string;
        year: number;
        director: string;
        rating: number;
        genre: string;
        synopsis: string;
        imageUrl: string;
      }>;
    },
  });

  const createMovie = useMutation({
    mutationFn: async (payload: {
      title: string;
      year: number;
      director: string;
      rating: number;
      genre: string;
      synopsis: string;
      imageUrl: string;
    }) => {
      const res = await fetch("/api/movies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create movie");
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["movies"] }),
  });

  const deleteMovie = useMutation({
    mutationFn: async (id?: number) => {
      if (!id) throw new Error("Missing id");
      const res = await fetch(`/api/movies/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
      return true;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["movies"] }),
  });

  const filteredMovies = useMemo(() => {
    const list = movies ?? [];
    const q = searchQuery.toLowerCase();
    return list.filter((movie) =>
      movie.title.toLowerCase().includes(q) ||
      movie.director.toLowerCase().includes(q) ||
      movie.genre.toLowerCase().includes(q)
    );
  }, [movies, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
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

      {/* Movies Grid */}
      <section className="container mx-auto px-4 py-16">
        {/* Simple Add form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <Input placeholder="Titre" id="title" onChange={(e) => (window as any).newTitle = e.target.value} />
          <Input placeholder="Année" type="number" id="year" onChange={(e) => (window as any).newYear = Number(e.target.value)} />
          <Input placeholder="Réalisateur" id="director" onChange={(e) => (window as any).newDirector = e.target.value} />
          <Input placeholder="Note (0-10)" type="number" step="0.1" id="rating" onChange={(e) => (window as any).newRating = Number(e.target.value)} />
          <Input placeholder="Genre" id="genre" onChange={(e) => (window as any).newGenre = e.target.value} />
          <Input placeholder="Synopsis" id="synopsis" onChange={(e) => (window as any).newSynopsis = e.target.value} />
          <Input placeholder="Image URL" id="imageUrl" defaultValue="https://storage.googleapis.com/fright-finds-hub-images/alien.jpg" onChange={(e) => (window as any).newImageUrl = e.target.value} />
          <button
            className="h-10 rounded bg-primary text-primary-foreground px-4"
            onClick={() =>
              createMovie.mutate({
                title: (window as any).newTitle || "",
                year: (window as any).newYear || 2000,
                director: (window as any).newDirector || "",
                rating: (window as any).newRating || 5,
                genre: (window as any).newGenre || "",
                synopsis: (window as any).newSynopsis || "",
                imageUrl: (window as any).newImageUrl || "https://storage.googleapis.com/fright-finds-hub-images/alien.jpg",
              })
            }
          >
            Ajouter le film
          </button>
        </div>
        {isLoading && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">Chargement des films…</p>
          </div>
        )}
        {isError && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">Erreur lors du chargement des films</p>
          </div>
        )}
        {!isLoading && !isError && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMovies.map((movie, index) => (
              <MovieCard key={index} {...movie} onDelete={(id) => deleteMovie.mutate(id)} />
            ))}
          </div>
        )}

        {filteredMovies.length === 0 && (
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
