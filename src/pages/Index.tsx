import { useState } from "react";
import MovieCard from "@/components/MovieCard";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

import heroImage from "@/assets/hero-horror.jpg";
import shiningImage from "@/assets/shining.jpg";
import halloweenImage from "@/assets/halloween.jpg";
import exorcistImage from "@/assets/exorcist.jpg";
import alienImage from "@/assets/alien.jpg";
import psychoImage from "@/assets/psycho.jpg";
import thingImage from "@/assets/the_thing.jpg";
import nightmareImage from "@/assets/nightmare.jpg";
import rosemaryImage from "@/assets/rosemary.jpg";
import chainsawImage from "@/assets/chainsaw.jpg";


const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const horrorMovies = [
    {
      title: "The Shining",
      year: 1980,
      director: "Stanley Kubrick",
      rating: 8.4,
      genre: "Horreur psychologique",
      synopsis: "Un écrivain accepte un emploi de gardien d'hiver dans un hôtel isolé avec sa femme et son fils, mais l'hôtel cache des secrets terrifiants.",
      imageUrl: shiningImage
    },
    {
      title: "Halloween",
      year: 1978,
      director: "John Carpenter",
      rating: 7.7,
      genre: "Slasher",
      synopsis: "Un tueur masqué s'échappe d'un hôpital psychiatrique et retourne dans sa ville natale pour terroriser une jeune baby-sitter.",
      imageUrl: halloweenImage
    },
    {
      title: "The Exorcist",
      year: 1973,
      director: "William Friedkin",
      rating: 8.1,
      genre: "Possession démoniaque",
      synopsis: "Une jeune fille est possédée par une entité démoniaque. Sa mère fait appel à deux prêtres pour un exorcisme.",
      imageUrl: exorcistImage
    },
    {
      title: "Alien",
      year: 1979,
      director: "Ridley Scott",
      rating: 8.5,
      genre: "Horreur science-fiction",
      synopsis: "L'équipage d'un vaisseau spatial découvre une forme de vie extraterrestre mortelle à bord.",
      imageUrl: alienImage
    },
    {
      title: "Psycho",
      year: 1960,
      director: "Alfred Hitchcock",
      rating: 8.5,
      genre: "Thriller psychologique",
      synopsis: "Une jeune femme en fuite s'arrête dans un motel isolé géré par un jeune homme sous la domination de sa mère.",
      imageUrl: psychoImage
    },
    {
      title: "The Thing",
      year: 1982,
      director: "John Carpenter",
      rating: 8.2,
      genre: "Horreur science-fiction",
      synopsis: "Une équipe de recherche en Antarctique découvre un organisme extraterrestre qui peut imiter n'importe quelle forme de vie.",
      imageUrl: thingImage
    },
    {
      title: "A Nightmare on Elm Street",
      year: 1984,
      director: "Wes Craven",
      rating: 7.4,
      genre: "Slasher surnaturel",
      synopsis: "Un tueur défiguré hante les rêves d'adolescents, les tuant dans leur sommeil.",
      imageUrl: nightmareImage
    },
    {
      title: "Rosemary's Baby",
      year: 1968,
      director: "Roman Polanski",
      rating: 8.0,
      genre: "Horreur psychologique",
      synopsis: "Une jeune femme enceinte soupçonne que ses voisins font partie d'une secte satanique ayant des plans pour son bébé.",
      imageUrl: rosemaryImage
    },
    {
      title: "The Texas Chain Saw Massacre",
      year: 1974,
      director: "Tobe Hooper",
      rating: 7.5,
      genre: "Slasher",
      synopsis: "Cinq amis tombent sur une famille de cannibales dans le Texas rural, dont un tueur à la tronçonneuse masqué.",
      imageUrl: chainsawImage
    }
  ];

  const filteredMovies = horrorMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.director.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMovies.map((movie, index) => (
            <MovieCard key={index} {...movie} />
          ))}
        </div>

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
