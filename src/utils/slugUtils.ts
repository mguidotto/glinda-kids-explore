
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};

export const ensureUniqueSlug = async (baseSlug: string, contentId?: string) => {
  const { supabase } = await import('@/integrations/supabase/client');
  
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const query = supabase
      .from('contents')
      .select('id')
      .eq('slug', slug);
    
    // Exclude current content if updating
    if (contentId) {
      query.neq('id', contentId);
    }
    
    const { data, error } = await query.maybeSingle();
    
    if (error) {
      console.error('Error checking slug uniqueness:', error);
      break;
    }
    
    if (!data) {
      // Slug is unique
      break;
    }
    
    // Generate new slug with counter
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
};
