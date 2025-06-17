
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
import { DemoDataSeeder } from "@/components/DemoDataSeeder";
import { useContents } from "@/hooks/useContents";
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

  // Transform contents for display
  const transformedContents = contents.map((content: Content) => ({
    id: content.id,
    title: content.title || "",
    description: content.description || "",
    category: (content as any).categories?.name || "",
    city: content.city || "",
    price: content.price_from || 0,
    image: content.images?.[0] || "/placeholder.svg",
    rating: 4.8, // Mock data
    reviews: Math.floor(Math.random() * 50) + 5, // Mock data
    provider: (content as any).providers?.business_name || "Provider",
    duration: content.duration_minutes,
    participants: content.max_participants,
    distance: content.distance_km
  }));

  // Filter contents by category for different sections
  const nidiContents = transformedContents.filter(c => c.category.toLowerCase().includes('nido')).slice(0, 4);
  const summerContents = transformedContents.filter(c => 
    c.category.toLowerCase().includes('campo') || 
    c.category.toLowerCase().includes('estiv') ||
    c.category.toLowerCase().includes('sport')
  ).slice(0, 4);
  const featuredContents = transformedContents.filter((_, index) => index % 2 === 0).slice(0, 4);
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

  return (
    <div className="min-h-screen bg-white">
      <DemoDataSeeder />
      <Navigation />
      
      <Hero />

      {/* Search Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 -mt-8 relative z-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Cerca corsi, eventi, servizi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={currentLocation ? "default" : "outline"} 
                  size="lg" 
                  className={`flex items-center gap-2 ${currentLocation ? 'bg-[#8B4A6B] hover:bg-[#7A4060]' : 'border-[#8B4A6B] text-[#8B4A6B] hover:bg-[#8B4A6B] hover:text-white'}`}
                  onClick={() => setShowLocationSearch(!showLocationSearch)}
                >
                  <MapPin className="h-4 w-4" />
                  {currentLocation ? "Vicino a te" : "Località"}
                </Button>
                <Button variant="outline" size="lg" className="flex items-center gap-2 border-[#8B4A6B] text-[#8B4A6B] hover:bg-[#8B4A6B] hover:text-white">
                  <Filter className="h-4 w-4" />
                  Filtri
                </Button>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-[#8B4A6B] to-[#7BB3BD] hover:from-[#7A4060] hover:to-[#6BA3AD]"
                  onClick={handleSearch}
                >
                  Cerca
                </Button>
              </div>
            </div>

            {/* Location Search */}
            {showLocationSearch && (
              <div className="border-t pt-4">
                <LocationSearch 
                  onLocationSelect={handleLocationSelect}
                  className="max-w-md mx-auto"
                />
              </div>
            )}

            {/* Current Location Display */}
            {currentLocation && (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  Risultati vicino a: {currentLocation.address || "Posizione attuale"}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearLocation}
                  className="text-xs"
                >
                  Rimuovi
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <CategoryFilter 
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      {/* Homepage Sections in TripAdvisor style */}
      {nidiContents.length > 0 && (
        <HomeSection 
          title="Nidi più apprezzati"
          subtitle="I migliori asili nido scelti dalle famiglie"
          contents={nidiContents}
          sectionType="nidi"
        />
      )}

      {summerContents.length > 0 && (
        <HomeSection 
          title="Le migliori attività per l'estate"
          subtitle="Campi estivi, sport e divertimento all'aria aperta"
          contents={summerContents}
          sectionType="summer"
        />
      )}

      {featuredContents.length > 0 && (
        <HomeSection 
          title="Corsi per bambini 0-12"
          subtitle="Attività educative e ricreative per tutte le età"
          contents={featuredContents}
          sectionType="featured"
        />
      )}

      {cityContents.length > 0 && (
        <HomeSection 
          title="Le città più attive"
          subtitle="Scopri le migliori attività nelle principali città italiane"
          contents={cityContents}
          sectionType="cities"
        />
      )}

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#8B4A6B] mb-2">{contents.length}</div>
              <div className="text-gray-600">Contenuti Disponibili</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#FF6B7A] mb-2">12,450</div>
              <div className="text-gray-600">Genitori Registrati</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#7BB3BD] mb-2">8,340</div>
              <div className="text-gray-600">Prenotazioni Completate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#F4D03F] mb-2">4.8</div>
              <div className="text-gray-600">Valutazione Media</div>
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
              <p className="text-gray-300">Il marketplace per genitori consapevoli.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categorie</h4>
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
              <h4 className="font-semibold mb-4">Supporto</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/support" className="hover:text-[#7BB3BD]">Centro Assistenza</Link></li>
                <li><Link to="/contact" className="hover:text-[#7BB3BD]">Contattaci</Link></li>
                <li><Link to="/faq" className="hover:text-[#7BB3BD]">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Partner</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link to="/auth" className="hover:text-[#7BB3BD]">Diventa Partner</Link></li>
                <li><Link to="/provider-dashboard" className="hover:text-[#7BB3BD]">Area Partner</Link></li>
                <li><Link to="/advertising" className="hover:text-[#7BB3BD]">Pubblicità</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Glinda. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
