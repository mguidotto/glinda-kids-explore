
import { Database } from "@/integrations/supabase/types";

type Content = {
  id: string;
  slug?: string | null;
  categories?: { slug: string } | null;
};

export const useContentUrl = () => {
  const getContentUrl = (content: Content): string => {
    // Always check if we have both slug and category slug
    if (content.slug && content.slug.trim() && content.categories?.slug && content.categories.slug.trim()) {
      return `/${content.categories.slug}/${content.slug}`;
    }
    
    // Fallback to ID-based URL for any content without proper slug structure
    return `/content/${content.id}`;
  };

  const generateUrl = (id: string, slug?: string | null, categorySlug?: string | null): string => {
    // Use category/content slug pattern if both are available
    if (slug && slug.trim() && categorySlug && categorySlug.trim()) {
      return `/${categorySlug}/${slug}`;
    }
    
    // Fallback to ID-based routing
    return `/content/${id}`;
  };

  return { getContentUrl, generateUrl };
};
