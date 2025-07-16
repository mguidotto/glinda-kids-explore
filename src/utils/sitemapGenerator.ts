
import { supabase } from "@/integrations/supabase/client";

export const generateDynamicSitemap = async () => {
  const baseUrl = 'https://glinda.lovable.app';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/search', priority: '0.8', changefreq: 'weekly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.5', changefreq: 'monthly' }
  ];

  try {
    // Fetch dynamic content pages with better error handling
    const { data: contents, error: contentsError } = await supabase
      .from('contents')
      .select(`
        id, 
        title, 
        updated_at, 
        slug,
        categories!inner(slug)
      `)
      .eq('published', true)
      .order('updated_at', { ascending: false });

    if (contentsError) {
      console.error('Error fetching contents:', contentsError);
    }

    // Fetch categories for category pages with better error handling
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('slug')
      .eq('active', true);

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
    }

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add static pages
    staticPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    // Add content pages with both URL formats for compatibility
    contents?.forEach(content => {
      const lastmod = content.updated_at ? new Date(content.updated_at).toISOString().split('T')[0] : currentDate;
      
      // Add slug-based URL if available
      if (content.slug && content.categories?.slug) {
        sitemap += `
  <url>
    <loc>${baseUrl}/${content.categories.slug}/${content.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
      }
      
      // Always add ID-based URL as fallback
      sitemap += `
  <url>
    <loc>${baseUrl}/content/${content.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    });

    // Add category search pages
    categories?.forEach(category => {
      sitemap += `
  <url>
    <loc>${baseUrl}/search?category=${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    return sitemap;
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    
    // Return minimal sitemap as fallback
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
  }
};
