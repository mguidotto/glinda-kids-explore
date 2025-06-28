
import { Database } from "@/integrations/supabase/types";

type Content = {
  id: string;
  slug?: string | null;
  categories?: { slug: string } | null;
};

export const useContentUrl = () => {
  const getContentUrl = (content: Content): string => {
    // Se il contenuto ha uno slug e una categoria, usa il formato categoria/slug
    if (content.slug && content.categories?.slug) {
      return `/${content.categories.slug}/${content.slug}`;
    }
    
    // Altrimenti usa il formato tradizionale con ID
    return `/content/${content.id}`;
  };

  return { getContentUrl };
};
