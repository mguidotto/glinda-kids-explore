
import { supabase } from "@/integrations/supabase/client";

export const generateDynamicSitemap = async () => {
  const baseUrl = 'https://www.glinda.it';
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Static pages
  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'daily' },
    { url: '/search', priority: '0.8', changefreq: 'weekly' },
    { url: '/about', priority: '0.7', changefreq: 'monthly' },
    { url: '/contact', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.5', changefreq: 'yearly' }
  ];

  // Fetch dynamic content pages
  const { data: contents } = await supabase
    .from('contents')
    .select('id, title, updated_at, slug')
    .eq('published', true)
    .order('updated_at', { ascending: false });

  // Fetch categories for category pages
  const { data: categories } = await supabase
    .from('categories')
    .select('slug')
    .eq('active', true);

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

  // Add content pages
  contents?.forEach(content => {
    const lastmod = content.updated_at ? new Date(content.updated_at).toISOString().split('T')[0] : currentDate;
    sitemap += `
  <url>
    <loc>${baseUrl}/content/${content.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  });

  // Add category search pages
  categories?.forEach(category => {
    sitemap += `
  <url>
    <loc>${baseUrl}/search?category=${category.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
};
