import { Search, MapPin, Calendar, Users, Star, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import CategoryFilter from "@/components/CategoryFilter";
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
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { contents, categories, loading, fetchContents } = useContents();
  const { getText } = useAppTexts();

  // SEO ottimizzato per homepage
  useSEO({
    title: 'Glinda - Trova le Migliori Attività per Bambini 0-10 anni | Corsi, Eventi, Servizi Educativi',
    description: 'Marketplace #1 per genitori: scopri corsi, eventi e servizi educativi verificati per bambini da 0 a 10 anni. Prenota online le migliori attività vicino a te!',
    keywords: 'attività bambini, corsi bambini infanzia, eventi famiglia, servizi educativi, laboratori creativi, sport bambini, musica bambini, arte bambini',
    canonical: 'https://glinda.lovable.app/'
  });

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

  // Contenuti in evidenza - filtrati per featured = true
  const featuredContents = transformedContents.filter(c => 
    contents.find(orig => orig.id === c.id)?.featured === true
  ).slice(0, 4);

  // Fix: Corretto l'ID della categoria "Servizi Educativi" da '1d46a6f7-5d27-48bb-979d-377d35ab29c6' a 'dbc5448f-0d00-4ec1-aafd-d91c4e967f39'
  const serviziEducativiContents = transformedContents.filter(c => 
    contents.find(orig => orig.id === c.id)?.category_id === 'dbc5448f-0d00-4ec1-aafd-d91c4e967f39'
  ).slice(0, 4);
  
  // Fix: Corretto l'ID della categoria "Corsi" da 'a0bbb1bb-d132-4ba4-8c25-89809e077c58' a '35449c9a-2a44-4b97-9d2e-8ce85b69c4cc'
  const corsiContents = transformedContents.filter(c => 
    contents.find(orig => orig.id === c.id)?.category_id === '35449c9a-2a44-4b97-9d2e-8ce85b69c4cc'
  ).slice(0, 4);
  
  // Fix: Corretto l'ID della categoria "Eventi" da 'b7d5d55e-f19a-46a5-b037-e08ea25b7aff' a 'e378ba01-8790-4e60-8eb8-b94a27800fc1'
  const eventiContents = transformedContents.filter(c => 
    contents.find(orig => orig.id === c.id)?.category_id === 'e378ba01-8790-4e60-8eb8-b94a27800fc1'
  ).slice(0, 4);

  // Corretto il contatore delle categorie - ora mostra solo i contenuti effettivamente presenti nelle sezioni
  const categoryOptions = [
    { id: "all", name: "Tutti", count: contents.length },
    ...categories.map(cat => {
      let count = 0;
      if (cat.slug === 'servizi-educativi') {
        count = serviziEducativiContents.length;
      } else if (cat.slug === 'corsi') {
        count = corsiContents.length;
      } else if (cat.slug === 'eventi') {
        count = eventiContents.length;
      } else {
        count = contents.filter(c => (c as any).categories?.slug === cat.slug).length;
      }
      return {
        id: cat.slug,
        name: cat.name,
        count: count
      };
    }).filter(cat => cat.count > 0) // Filtra le categorie con 0 elementi
  ];

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

  // Fix: Corretta la funzione handleExploreActivities
  const handleExploreActivities = () => {
    console.log('Navigating to search page...');
    navigate('/search');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Struttura SEO ottimizzata con H1 principale */}
      <header>
        <h1 className="sr-only">Glinda - Marketplace Attività Educative per Bambini da 0 a 10 anni</h1>
      </header>
      
      <Hero onSearch={handleSearch} onExploreActivities={handleExploreActivities} />

      <main>
        <section className="py-8 px-4 max-w-6xl mx-auto" data-section="categories" aria-labelledby="categories-heading">
          <h2 id="categories-heading" className="sr-only">Categorie di Attività</h2>
          <CategoryFilter 
            categories={categoryOptions}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </section>

        {featuredContents.length > 0 && (
          <section aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="sr-only">Contenuti in Evidenza</h2>
            <HomeSection 
              title={getText('homepage.featured.title', 'Contenuti in Evidenza')}
              subtitle={getText('homepage.featured.subtitle', 'Le migliori attività selezionate per te')}
              contents={featuredContents}
              sectionType="featured"
              onViewAll={() => navigate('/search?featured=true')}
            />
          </section>
        )}

        {serviziEducativiContents.length > 0 && (
          <section aria-labelledby="servizi-educativi-heading">
            <h2 id="servizi-educativi-heading" className="sr-only">Servizi Educativi per Bambini</h2>
            <HomeSection 
              title={getText('homepage.servizi_educativi.title', 'Servizi Educativi')}
              subtitle={getText('homepage.servizi_educativi.subtitle', 'I migliori servizi educativi per i tuoi bambini')}
              contents={serviziEducativiContents}
              sectionType="featured"
              onViewAll={() => handleViewAll('dbc5448f-0d00-4ec1-aafd-d91c4e967f39')}
            />
          </section>
        )}

        {corsiContents.length > 0 && (
          <section aria-labelledby="corsi-heading">
            <h2 id="corsi-heading" className="sr-only">Corsi per Bambini</h2>
            <HomeSection 
              title={getText('homepage.corsi.title', 'Corsi')}
              subtitle={getText('homepage.corsi.subtitle', 'Corsi e attività formative per bambini')}
              contents={corsiContents}
              sectionType="featured"
              onViewAll={() => handleViewAll('35449c9a-2a44-4b97-9d2e-8ce85b69c4cc')}
            />
          </section>
        )}

        {eventiContents.length > 0 && (
          <section aria-labelledby="eventi-heading">
            <h2 id="eventi-heading" className="sr-only">Eventi per Famiglie</h2>
            <HomeSection 
              title={getText('homepage.eventi.title', 'Eventi per tutta la famiglia')}
              subtitle={getText('homepage.eventi.subtitle', 'Eventi e attività per tutta la famiglia')}
              contents={eventiContents}
              sectionType="cities"
              onViewAll={() => handleViewAll('e378ba01-8790-4e60-8eb8-b94a27800fc1')}
            />
          </section>
        )}

        <section className="py-16 bg-gray-50" aria-labelledby="stats-heading">
          <div className="max-w-6xl mx-auto px-4">
            <h2 id="stats-heading" className="sr-only">Le Nostre Statistiche</h2>
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
      </main>
    </div>
  );
};

export default Index;
