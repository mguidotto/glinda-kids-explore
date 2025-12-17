/**
 * Script to fetch all published content paths from Supabase for SSG pre-rendering
 * This runs at build time to generate static HTML for all content pages
 */

const SUPABASE_URL = 'https://rnxiazinwdpyhviyjdwt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJueGlhemlud2RweWh2aXlqZHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDQyMjcsImV4cCI6MjA2NTM4MDIyN30.Z6jdozMX8QNLQbzZns2HzR3l3Lo18SuFeGooc3Or4Sk';

interface Content {
  id: string;
  slug: string | null;
  title: string;
  categories: {
    slug: string;
  } | null;
}

interface Category {
  slug: string;
  active: boolean;
}

export async function getContentPaths(): Promise<string[]> {
  try {
    // Fetch all published contents with their category
    const contentsResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/contents?select=id,slug,title,categories(slug)&published=eq.true`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!contentsResponse.ok) {
      console.error('Failed to fetch contents:', contentsResponse.statusText);
      return [];
    }

    const contents = (await contentsResponse.json()) as Content[];
    const paths: string[] = [];

    for (const content of contents) {
      // Add path with content slug if available
      if (content.slug) {
        paths.push(`/content/${content.slug}`);
        
        // Also add category/content path if category exists
        if (content.categories?.slug) {
          paths.push(`/${content.categories.slug}/${content.slug}`);
        }
      }
      
      // Also add path with ID as fallback
      paths.push(`/content/${content.id}`);
    }

    console.log(`[SSG] Found ${contents.length} contents, generating ${paths.length} paths`);
    return paths;
  } catch (error) {
    console.error('[SSG] Error fetching content paths:', error);
    return [];
  }
}

export async function getCategoryPaths(): Promise<string[]> {
  try {
    const categoriesResponse = await fetch(
      `${SUPABASE_URL}/rest/v1/categories?select=slug&active=eq.true`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!categoriesResponse.ok) {
      console.error('Failed to fetch categories:', categoriesResponse.statusText);
      return [];
    }

    const categories = (await categoriesResponse.json()) as Category[];
    const paths = categories.map(cat => `/${cat.slug}`);

    console.log(`[SSG] Found ${categories.length} categories`);
    return paths;
  } catch (error) {
    console.error('[SSG] Error fetching category paths:', error);
    return [];
  }
}

export async function getAllPaths(): Promise<string[]> {
  const [contentPaths, categoryPaths] = await Promise.all([
    getContentPaths(),
    getCategoryPaths(),
  ]);

  // Static pages
  const staticPaths = [
    '/',
    '/about',
    '/contact',
    '/privacy',
    '/search',
  ];

  const allPaths = [...new Set([...staticPaths, ...categoryPaths, ...contentPaths])];
  console.log(`[SSG] Total paths to pre-render: ${allPaths.length}`);
  
  return allPaths;
}
