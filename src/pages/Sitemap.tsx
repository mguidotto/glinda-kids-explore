
import { useEffect, useState } from "react";
import { generateDynamicSitemap } from "@/utils/sitemapGenerator";

const Sitemap = () => {
  const [sitemap, setSitemap] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSitemap = async () => {
      try {
        const generatedSitemap = await generateDynamicSitemap();
        setSitemap(generatedSitemap);
      } catch (error) {
        console.error("Error generating sitemap:", error);
        // Fallback to basic sitemap structure
        setSitemap(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://glinda.lovable.app/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
      } finally {
        setLoading(false);
      }
    };

    loadSitemap();
  }, []);

  if (loading) {
    return <div>Generating sitemap...</div>;
  }

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      margin: 0,
      padding: 0
    }}>
      {sitemap}
    </pre>
  );
};

export default Sitemap;
