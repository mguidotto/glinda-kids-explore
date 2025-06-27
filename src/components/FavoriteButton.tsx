
import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FavoriteButtonProps {
  contentId: string;
  isFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

const FavoriteButton = ({ contentId, isFavorite = false, onToggle }: FavoriteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [favorite, setFavorite] = useState(isFavorite);
  const { user } = useAuth();

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Devi effettuare l'accesso per salvare i preferiti");
      return;
    }

    setIsLoading(true);

    try {
      if (favorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', contentId);

        if (error) throw error;
        
        setFavorite(false);
        onToggle?.(false);
        toast.success("Rimosso dai preferiti");
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            content_id: contentId
          });

        if (error) throw error;
        
        setFavorite(true);
        onToggle?.(true);
        toast.success("Aggiunto ai preferiti");
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error("Errore nel gestire i preferiti");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className="bg-white/80 hover:bg-white p-2"
    >
      <Heart className={`h-4 w-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
    </Button>
  );
};

export default FavoriteButton;
