
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

type Content = Database["public"]["Tables"]["contents"]["Row"] & {
  providers: { business_name: string; verified: boolean };
  categories: { name: string; slug: string };
  distance_km?: number;
  featured_image?: string;
};

const Index = () => {
  const navigate = useNavigate();
  const { contents, categories, loading, fetchContents } = useContents();
  const { getText } = useAppTexts();

  // SEO ottimizzato per homepage con i nuovi valori
  useSEO({
    title: 'Scopri corsi, eventi e servizi educativi per i tuoi bambini',
    description: 'Glinda aiuta i genitori a trovare le migliori opportunità vicino a te.',
    keywords: 'attività bambini, corsi bambini infanzia, eventi famiglia, servizi educativi, laboratori creativi, sport bambini, musica bambini, arte bambini',
    canonical: 'https://glinda.lovable.app/'
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
    categories: (content as any).categories
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
    <div className="min-h-screen bg-white">
      <header>
        <h1 className="sr-only">Glinda - Piattaforma Attività Educative per Bambini da 0 a 10 anni</h1>
      </header>
      
      <Hero onSearch={handleSearch} onExploreActivities={handleExploreActivities} />

      <main>
        {featuredContents.length > 0 && (
          <section aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="sr-only">Contenuti in Evidenza</h2>
            <HomeSection 
              title={getText('homepage.featured.title', 'Contenuti in Evidenza')}
              subtitle={getText('homepage.featured.subtitle', 'Le migliori attività selezionate per te')}
              contents={featuredContents}
              sectionType="featured"
              onViewAll={handleViewAll}
            />
          </section>
        )}

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
  );
};

export default Index;
