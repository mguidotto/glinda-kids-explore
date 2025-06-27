import { Search, MapPin, Calendar, Users, Star, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import CategoryFilter from "@/components/CategoryFilter";
import Hero from "@/components/Hero";
import HomeSection from "@/components/HomeSections";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import { useContents } from "@/hooks/useContents";
import { useAppTexts } from "@/hooks/useAppTexts";
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { contents, categories, loading, fetchContents } = useContents();
  const { getText } = useAppTexts();
  const [stats, setStats] = useState({
    totalContents: 0,
    verifiedProviders: 0,
    totalBookings: 8340,
    avgRating: 4.8
  });

  useEffect(() => {
    fetchContents({ 
      category: selectedCategory === "all" ? undefined : selectedCategory
    });
  }, [selectedCategory]);

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
          totalBookings: 8340,
          avgRating: 4.8
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const categoryOptions = [
    { id: "all", name: "Tutti", count: contents.length },
    ...categories.map(cat => ({
      id: cat.slug,
      name: cat.name,
      count: contents.filter(c => (c as any).categories?.slug === cat.slug).length
    }))
  ];

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
    content_type: content.content_type,
    price_from: content.price_from,
    payment_type: content.payment_type
  }));

  const serviziEducativiContents = transformedContents.filter(c => 
    contents.find(orig => orig.id === c.id)?.category_id === '1d46a6f7-5d27-48bb-979d-377d35ab29c6'
  ).slice(0, 4);
  
  const corsiContents = transformedContents.filter(c => 
    contents.find(orig => orig.id === c.id)?.category_id === 'a0bbb1bb-d132-4ba4-8c25-89809e077c58'
  ).slice(0, 4);
  
  const eventiContents = transformedContents.filter(c => 
    contents.find(orig => orig.id === c.id)?.category_id === 'b7d5d55e-f19a-46a5-b037-e08ea25b7aff'
  ).slice(0, 4);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleViewAll = (categoryId?: string) => {
    if (categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        navigate(`/search?category=${category.slug}`);
        return;
      }
    }
    navigate('/search');
  };

  const handleExploreActivities = () => {
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <Hero onSearch={handleSearch} onExploreActivities={handleExploreActivities} />

      <section className="py-8 px-4 max-w-6xl mx-auto" data-section="categories">
        <CategoryFilter 
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      {serviziEducativiContents.length > 0 && (
        <HomeSection 
          title={getText('homepage.servizi_educativi.title', 'Servizi Educativi')}
          subtitle={getText('homepage.servizi_educativi.subtitle', 'I migliori servizi educativi per i tuoi bambini')}
          contents={serviziEducativiContents}
          sectionType="featured"
          onViewAll={() => handleViewAll('1d46a6f7-5d27-48bb-979d-377d35ab29c6')}
        />
      )}

      {corsiContents.length > 0 && (
        <HomeSection 
          title={getText('homepage.corsi.title', 'Corsi')}
          subtitle={getText('homepage.corsi.subtitle', 'Corsi e attività formative per bambini')}
          contents={corsiContents}
          sectionType="featured"
          onViewAll={() => handleViewAll('a0bbb1bb-d132-4ba4-8c25-89809e077c58')}
        />
      )}

      {eventiContents.length > 0 && (
        <HomeSection 
          title={getText('homepage.eventi.title', 'Eventi per tutta la famiglia')}
          subtitle={getText('homepage.eventi.subtitle', 'Eventi e attività per tutta la famiglia')}
          contents={eventiContents}
          sectionType="cities"
          onViewAll={() => handleViewAll('b7d5d55e-f19a-46a5-b037-e08ea25b7aff')}
        />
      )}

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#8B4A6B] mb-2">{stats.totalContents}</div>
              <div className="text-gray-600">{getText('homepage.stats.contents', 'Contenuti Verificati')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FF6B7A] mb-2">{stats.verifiedProviders}</div>
              <div className="text-gray-600">{getText('homepage.stats.providers', 'Provider Certificati')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#7BB3BD] mb-2">{stats.totalBookings}</div>
              <div className="text-gray-600">{getText('homepage.stats.bookings', 'Prenotazioni Completate')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#F4D03F] mb-2">{stats.avgRating}</div>
              <div className="text-gray-600">{getText('homepage.stats.rating', 'Valutazione Media')}</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
