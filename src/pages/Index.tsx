
import { Search, MapPin, Calendar, Users, Star, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import CategoryFilter from "@/components/CategoryFilter";
import Hero from "@/components/Hero";
import HomeSection from "@/components/HomeSections";
import LocationSearch from "@/components/LocationSearch";
import SearchBar from "@/components/SearchBar";
import Footer from "@/components/Footer";
import { useContents } from "@/hooks/useContents";
import { useAppTexts } from "@/hooks/useAppTexts";
import { Database } from "@/integrations/supabase/types";

type Content = Database["public"]["Tables"]["contents"]["Row"] & {
  providers: { business_name: string; verified: boolean };
  categories: { name: string; slug: string };
  distance_km?: number;
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const { contents, categories, loading, fetchContents } = useContents();
  const { getText } = useAppTexts();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContents({ 
      category: selectedCategory === "all" ? undefined : selectedCategory,
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
      radius: 50
    });
  }, [selectedCategory, currentLocation]);

  // Transform categories for CategoryFilter component
  const categoryOptions = [
    { id: "all", name: "Tutti", count: contents.length },
    ...categories.map(cat => ({
      id: cat.slug,
      name: cat.name,
      count: contents.filter(c => (c as any).categories?.slug === cat.slug).length
    }))
  ];

  // Transform contents for display with real data only
  const transformedContents = contents.map((content: Content) => ({
    id: content.id,
    title: content.title || "",
    description: content.description || "",
    category: (content as any).categories?.name || "",
    city: content.city || "",
    price: content.price_from || 0,
    image: content.images?.[0] || "/placeholder.svg",
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

  // Filter contents by specific category IDs
  const serviziEducativiContents = transformedContents.filter(c => 
    contents.find(orig => orig.id === c.id)?.category_id === '1d46a6f7-5d27-48bb-979d-377d35ab29c6'
  ).slice(0, 4);
  
  const corsiContents = transformedContents.filter(c => 
    contents.find(orig => orig.id === c.id)?.category_id === 'a0bbb1bb-d132-4ba4-8c25-89809e077c58'
  ).slice(0, 4);
  
  const eventiContents = transformedContents.filter(c => 
    contents.find(orig => orig.id === c.id)?.category_id === 'b7d5d55e-f19a-46a5-b037-e08ea25b7aff'
  ).slice(0, 4);

  const handleLocationSelect = (latitude: number, longitude: number, address?: string) => {
    setCurrentLocation({ latitude, longitude, address });
  };

  const clearLocation = () => {
    setCurrentLocation(null);
  };

  const handleViewAll = (categoryId?: string) => {
    const params = new URLSearchParams();
    if (categoryId) {
      const category = categories.find(cat => cat.id === categoryId);
      if (category) {
        params.set("category", category.slug);
      }
    }
    navigate(`/search?${params.toString()}`);
  };

  const handleExploreActivities = () => {
    navigate('/search');
  };

  const publishedContentsCount = contents.filter(c => c.published).length;
  const verifiedProvidersCount = contents.filter(c => (c as any).providers?.verified).length;

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#8B4A6B] via-[#7BB3BD] to-[#F4D03F] py-20 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png" 
              alt="Glinda" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Scopri le migliori attività per i tuoi bambini
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Il marketplace che connette genitori consapevoli con i migliori servizi educativi
          </p>
          
          <div className="max-w-2xl mx-auto mb-8">
            <SearchBar className="bg-white rounded-lg p-1" />
          </div>

          <div className="flex justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-white text-[#8B4A6B] hover:bg-gray-100"
              onClick={handleExploreActivities}
            >
              Esplora Attività
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-[#8B4A6B]"
              asChild
            >
              <Link to="/auth">Diventa Partner</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 max-w-6xl mx-auto" data-section="categories">
        <CategoryFilter 
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      {/* Homepage Sections */}
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

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#8B4A6B] mb-2">{publishedContentsCount}</div>
              <div className="text-gray-600">{getText('homepage.stats.contents', 'Contenuti Disponibili')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FF6B7A] mb-2">{verifiedProvidersCount}</div>
              <div className="text-gray-600">{getText('homepage.stats.verified_providers', 'Provider Verificati')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#7BB3BD] mb-2">8,340</div>
              <div className="text-gray-600">{getText('homepage.stats.bookings', 'Prenotazioni Completate')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#F4D03F] mb-2">4.8</div>
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
