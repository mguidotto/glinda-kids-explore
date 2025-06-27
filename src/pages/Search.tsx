
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/Navigation";
import CategoryFilter from "@/components/CategoryFilter";
import LocationSearch from "@/components/LocationSearch";
import { ContentItemCard } from "@/components/HomeSections";
import Footer from "@/components/Footer";
import { useContents } from "@/hooks/useContents";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);
  const { contents, categories, loading, fetchContents } = useContents();

  useEffect(() => {
    const category = searchParams.get("category") || "all";
    const query = searchParams.get("q") || "";
    
    setSelectedCategory(category);
    setSearchQuery(query);
    
    fetchContents({ 
      category: category === "all" ? undefined : category,
      search: query || undefined,
      latitude: currentLocation?.latitude,
      longitude: currentLocation?.longitude,
      radius: 50
    });
  }, [searchParams, currentLocation]);

  const categoryOptions = [
    { id: "all", name: "Tutti", count: contents.length },
    ...categories.map(cat => ({
      id: cat.slug,
      name: cat.name,
      count: contents.filter(c => (c as any).categories?.slug === cat.slug).length
    }))
  ];

  const transformedContents = contents.map((content: any) => ({
    id: content.id,
    title: content.title || "",
    description: content.description || "",
    category: content.categories?.name || "",
    city: content.city || "",
    price: content.price_from || 0,
    image: content.images?.[0] || "/placeholder.svg",
    rating: null,
    reviews: null,
    provider: content.providers?.business_name || "Provider",
    duration: content.duration_minutes,
    participants: content.max_participants,
    distance: content.distance_km,
    content_type: content.content_type,
    price_from: content.price_from,
    payment_type: content.payment_type
  }));

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    setSearchParams(params);
  };

  const handleLocationSelect = (latitude: number, longitude: number, address?: string) => {
    setCurrentLocation({ latitude, longitude, address });
    setShowLocationSearch(false);
  };

  const clearLocation = () => {
    setCurrentLocation(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Cerca Attività</h1>
          
          {/* Search Bar */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cerca attività, corsi, eventi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowLocationSearch(!showLocationSearch)}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {currentLocation ? "Posizione selezionata" : "Posizione"}
            </Button>
            <Button onClick={handleSearch}>
              Cerca
            </Button>
          </div>

          {/* Location Search */}
          {showLocationSearch && (
            <div className="mb-6">
              <LocationSearch
                onLocationSelect={handleLocationSelect}
                onClose={() => setShowLocationSearch(false)}
                currentLocation={currentLocation}
                onClearLocation={clearLocation}
              />
            </div>
          )}

          {/* Categories */}
          <CategoryFilter 
            categories={categoryOptions}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {loading ? "Caricamento..." : `${transformedContents.length} risultati trovati`}
            </h2>
            {currentLocation && (
              <div className="text-sm text-gray-600">
                Risultati ordinati per distanza
              </div>
            )}
          </div>
        </div>

        {/* Content Grid */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {transformedContents.map((content) => (
              <ContentItemCard key={content.id} content={content} />
            ))}
          </div>
        )}

        {!loading && transformedContents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">Nessun risultato trovato</div>
            <div className="text-sm text-gray-400">
              Prova a modificare i filtri di ricerca
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchPage;
