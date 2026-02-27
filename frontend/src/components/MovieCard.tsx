import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button.tsx";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import peurImage from "@/assets/peur.jpg";

interface MovieCardProps {
  id?: number;
  title: string;
  year: number;
  director: string;
  rating: number;
  genre: string;
  synopsis: string;
  imageUrl: string;
  onDelete?: (id?: number) => void;
}

const MovieCard = ({ id, title, year, director, rating, genre, synopsis, imageUrl, onDelete }: MovieCardProps) => {
  return (
    <Card className="movie-card group overflow-hidden border-border bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(139,0,0,0.3)]">
      <div className="relative overflow-hidden aspect-[2/3]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = peurImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1 text-accent">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-semibold">{rating}</span>
            </div>
            {onDelete && (
              <Button variant="destructive" size="sm" onClick={() => onDelete(id)}>
                Supprimer
              </Button>
            )}
          </div>
        </div>
        <CardDescription className="text-muted-foreground">
          {year} • {director}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="mb-3">
          {genre}
        </Badge>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {synopsis}
        </p>
      </CardContent>
    </Card>
  );
};

export default MovieCard;
