
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FavoriteButtonProps {
  contentId: string;
  className?: string;
  onToggle?: (isFavorite: boolean) => void;
}

const FavoriteButton = ({ contentId, className = "", onToggle }: FavoriteButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('content_id', contentId)
          .maybeSingle();

        if (!error && data) {
          setIsFavorite(true);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [user, contentId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Devi effettuare l'accesso per salvare i preferiti");
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('content_id', contentId);

        if (error) throw error;
        
        setIsFavorite(false);
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
        
        setIsFavorite(true);
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
      className={`hover:bg-white/90 p-2 ${className}`}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
    </Button>
  );
};

export default FavoriteButton;
