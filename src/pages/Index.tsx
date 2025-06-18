
import { Search, MapPin, Calendar, Users, Star, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import CategoryFilter from "@/components/CategoryFilter";
import Hero from "@/components/Hero";
import HomeSection from "@/components/HomeSections";
import LocationSearch from "@/components/LocationSearch";
import { useContents } from "@/hooks/useContents";
import { useAppTexts } from "@/hooks/useAppTexts";
import { Database } from "@/integrations/supabase/types";

type Content = Database["public"]["Tables"]["contents"]["Row"] & {
  providers: { business_name: string; verified: boolean };
  categories: { name: string; slug: string };
  distance_km?: number;
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const { contents, categories, loading, fetchContents } = useContents();
  const { getText } = useAppTexts();

  useEffect(() => {
    fetchContents({ 
      category: selectedCategory === "all" ? undefined : selectedCategory,
      search: searchQuery || undefined,
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
      radius: 50
    });
  }, [selectedCategory, searchQuery, currentLocation]);

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
    rating: null, // No fake ratings
    reviews: null, // No fake reviews
    provider: (content as any).providers?.business_name || "Provider",
    duration: content.duration_minutes,
    participants: content.max_participants,
    distance: content.distance_km,
    content_type: content.content_type,
    price_from: content.price_from,
    payment_type: content.payment_type
  }));

  // Filter contents by category for different sections
  const nidiContents = transformedContents.filter(c => 
    c.category.toLowerCase().includes('nido') || 
    c.category.toLowerCase().includes('asilo')
  ).slice(0, 4);
  
  const summerContents = transformedContents.filter(c => 
    c.category.toLowerCase().includes('campo') || 
    c.category.toLowerCase().includes('estiv') ||
    c.category.toLowerCase().includes('sport')
  ).slice(0, 4);
  
  const featuredContents = transformedContents.filter(c => 
    c.category.toLowerCase().includes('corso')
  ).slice(0, 4);
  
  const cityContents = transformedContents.slice(0, 4);

  const handleSearch = () => {
    fetchContents({ 
      category: selectedCategory === "all" ? undefined : selectedCategory,
      search: searchQuery || undefined,
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
      radius: 50
    });
  };

  const handleLocationSelect = (latitude: number, longitude: number, address?: string) => {
    setCurrentLocation({ latitude, longitude, address });
    setShowLocationSearch(false);
  };

  const clearLocation = () => {
    setCurrentLocation(null);
  };

  const handleViewAll = (category?: string) => {
    if (category) {
      setSelectedCategory(category);
    }
    // Scroll to the categories section
    const categoriesSection = document.querySelector('[data-section="categories"]');
    categoriesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <Hero />

      {/* Categories */}
      <section className="py-8 px-4 max-w-6xl mx-auto" data-section="categories">
        <CategoryFilter 
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      {/* Homepage Sections */}
      {nidiContents.length > 0 && (
        <HomeSection 
          title={getText('homepage.nidi.title', 'Nidi più apprezzati')}
          subtitle={getText('homepage.nidi.subtitle', 'I migliori asili nido scelti dalle famiglie')}
          contents={nidiContents}
          sectionType="nidi"
          onViewAll={() => handleViewAll('asili-nido')}
        />
      )}

      {summerContents.length > 0 && (
        <HomeSection 
          title={getText('homepage.summer.title', 'Le migliori attività per l\'estate')}
          subtitle={getText('homepage.summer.subtitle', 'Campi estivi, sport e divertimento all\'aria aperta')}
          contents={summerContents}
          sectionType="summer"
          onViewAll={() => handleViewAll('centri-estivi')}
        />
      )}

      {featuredContents.length > 0 && (
        <HomeSection 
          title={getText('homepage.featured.title', 'Corsi per bambini 0-12')}
          subtitle={getText('homepage.featured.subtitle', 'Attività educative e ricreative per tutte le età')}
          contents={featuredContents}
          sectionType="featured"
          onViewAll={() => handleViewAll('corsi')}
        />
      )}

      {cityContents.length > 0 && (
        <HomeSection 
          title={getText('homepage.cities.title', 'Le città più attive')}
          subtitle={getText('homepage.cities.subtitle', 'Scopri le migliori attività nelle principali città italiane')}
          contents={cityContents}
          sectionType="cities"
          onViewAll={() => handleViewAll()}
        />
      )}

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#8B4A6B] mb-2">{contents.length}</div>
              <div className="text-gray-600">{getText('homepage.stats.contents', 'Contenuti Disponibili')}</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FF6B7A] mb-2">12,450</div>
              <div className="text-gray-600">{getText('homepage.stats.parents', 'Genitori Registrati')}</div>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-[#F4D03F]">Glinda</h3>
              <p className="text-gray-300">{getText('footer.description', 'Il marketplace per genitori consapevoli.')}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{getText('footer.categories', 'Categorie')}</h4>
              <ul className="space-y-2 text-gray-300">
                {categories.slice(0, 4).map(cat => (
                  <li key={cat.id}>
                    <Link to={`/?category=${cat.slug}`} className="hover:text-[#7BB3BD]">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{getText('footer.support', 'Supporto')}</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/support" className="hover:text-[#7BB3BD]">{getText('footer.help', 'Centro Assistenza')}</Link></li>
                <li><Link to="/contact" className="hover:text-[#7BB3BD]">{getText('footer.contact', 'Contattaci')}</Link></li>
                <li><Link to="/faq" className="hover:text-[#7BB3BD]">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">{getText('footer.partner', 'Partner')}</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/auth" className="hover:text-[#7BB3BD]">{getText('footer.become_partner', 'Diventa Partner')}</Link></li>
                <li><Link to="/provider-dashboard" className="hover:text-[#7BB3BD]">{getText('footer.partner_area', 'Area Partner')}</Link></li>
                <li><Link to="/advertising" className="hover:text-[#7BB3BD]">{getText('footer.advertising', 'Pubblicità')}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Glinda. {getText('footer.rights', 'Tutti i diritti riservati.')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
