import { Search, MapPin, Calendar, Users, Star, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import HomeSection from "@/components/HomeSections";
import SearchBar from "@/components/SearchBar";
import { useContents } from "@/hooks/useContents";
import { useAppTexts } from "@/hooks/useAppTexts";
import { useSEO } from "@/hooks/useSEO";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import SEOPerformanceOptimizer from "@/components/seo/SEOPerformanceOptimizer";
import SchemaOrganization from "@/components/seo/SchemaOrganization";
import { useMetaTags } from "@/hooks/useMetaTags";

type Content = Database["public"]["Tables"]["contents"]["Row"] & {
  providers: { business_name: string; verified: boolean };
  categories: { name: string; slug: string; color?: string };
  distance_km?: number;
  featured_image?: string;
};

const Index = () => {
  const navigate = useNavigate();
  const { contents, categories, loading, fetchContents } = useContents();
  const { getText } = useAppTexts();

  // Enhanced SEO for homepage
  useMetaTags({
    title: 'Scopri corsi, eventi e servizi educativi per i tuoi bambini',
    description: 'Glinda aiuta i genitori a trovare le migliori opportunità vicino a te.',
    keywords: 'attività bambini, corsi bambini infanzia, eventi famiglia, servizi educativi, laboratori creativi, sport bambini, musica bambini, arte bambini',
    canonical: 'https://glinda.lovable.app/',
    ogType: 'website'
  });

  const [stats, setStats] = useState({
    totalContents: 0,
    verifiedProviders: 0,
    avgRating: 4.8
  });

  useEffect(() => {
    fetchContents({});
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { count: contentsCount } = await supabase
          .from('contents')
          .select('*', { count: 'exact', head: true })
          .eq('published', true);

        const { count: providersCount } = await supabase
          .from('providers')
          .select('*', { count: 'exact', head: true })
          .eq('verified', true);

        setStats({
          totalContents: contentsCount || 0,
          verifiedProviders: providersCount || 0,
          avgRating: 4.8
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const transformedContents = contents.map((content: Content) => ({
    id: content.id,
    title: content.title || "",
    description: content.description || "",
    category: (content as any).categories?.name || "",
    city: content.city || "",
    price: content.price_from || 0,
    image: content.featured_image || content.images?.[0] || "/placeholder.svg",
    rating: null,
    reviews: null,
    provider: (content as any).providers?.business_name || "Provider",
    duration: content.duration_minutes,
    participants: content.max_participants,
    distance: content.distance_km,
    price_from: content.price_from,
    payment_type: content.payment_type,
    slug: content.slug,
    modality: content.modality,
    categories: (content as any).categories ? {
      slug: (content as any).categories.slug
    } : null
  }));

  // Mostra tutti i contenuti in evidenza senza filtri categoria
  const featuredContents = transformedContents.filter(c => 
    contents.find(orig => orig.id === c.id)?.featured === true
  );

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleViewAll = () => {
    navigate('/search?featured=true');
  };

  const handleExploreActivities = () => {
    console.log('Navigating to search page...');
    navigate('/search');
  };

  return (
    <>
      <SEOPerformanceOptimizer />
      <SchemaOrganization />
      
      <div className="min-h-screen bg-white">
        <header>
          <h1 className="sr-only">Glinda - Piattaforma Attività Educative per Bambini da 0 a 10 anni</h1>
        </header>
        
        <Hero onSearch={handleSearch} onExploreActivities={handleExploreActivities} />

        <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50" aria-labelledby="about-heading">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 id="about-heading" className="text-3xl font-bold text-[#8B4A6B] mb-6">Chi siamo</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Glinda si occupa di raccogliere corsi per genitori, offrendo un supporto concreto e mirato alla genitorialità. 
              La nostra missione è quella di aiutare i genitori a trovare le risorse e le opportunità formative più adatte 
              per accompagnare al meglio la crescita dei propri figli, creando una rete di supporto e condivisione.
            </p>
          </div>
        </section>

        <main>
          <section className="py-16 bg-gray-50" aria-labelledby="stats-heading">
            <div className="max-w-6xl mx-auto px-4">
              <h2 id="stats-heading" className="sr-only">Le Nostre Statistiche</h2>
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-[#8B4A6B] mb-2">{stats.totalContents}</div>
                  <div className="text-gray-600">{getText('homepage.stats.contents', 'Contenuti Verificati')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#FF6B7A] mb-2">{stats.verifiedProviders}</div>
                  <div className="text-gray-600">{getText('homepage.stats.providers', 'Provider Certificati')}</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#F4D03F] mb-2">{stats.avgRating}</div>
                  <div className="text-gray-600">{getText('homepage.stats.rating', 'Valutazione Media')}</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Index;
