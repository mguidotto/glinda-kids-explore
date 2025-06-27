
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import LocationSearch from "@/components/LocationSearch";
import CategoryFilter from "@/components/CategoryFilter";
import ContentCard from "@/components/ContentCard";
import { useContents } from "@/hooks/useContents";
import { Button } from "@/components/ui/button";
import { MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
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
    category: (content as any).categories?.name || "",
    ageGroup: content.age_groups?.join(", ") || "",
    location: content.city || "",
    price: content.price_from || 0,
    image: content.featured_image || content.images?.[0] || "/placeholder.svg",
    rating: 4.5,
    reviews: 24,
    provider: (content as any).providers?.business_name || "Provider",
    mode: content.modality === 'presenza' ? 'In Presenza' : content.modality,
    distance: content.distance_km,
    purchasable: content.purchasable,
    payment_type: content.payment_type,
    price_from: content.price_from,
    price_to: content.price_to,
    booking_required: content.booking_required,
    stripe_price_id: content.stripe_price_id,
    providers: (content as any).providers
  }));

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleLocationSelect = (latitude: number, longitude: number, address?: string) => {
    setCurrentLocation({ latitude, longitude, address });
    setShowLocationSearch(false);
  };

  const clearLocation = () => {
    setCurrentLocation(null);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category !== 'all') {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cerca Attività</h1>
          
          <div className="space-y-4">
            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
            
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() => setShowLocationSearch(!showLocationSearch)}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                {currentLocation ? 'Modifica posizione' : 'Cerca vicino a me'}
              </Button>

              {currentLocation && (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {currentLocation.address || 'Posizione selezionata'}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearLocation}
                      className="h-auto p-0 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                </div>
              )}
            </div>

            {showLocationSearch && (
              <div className="border rounded-lg p-4 bg-white">
                <LocationSearch
                  onLocationSelect={handleLocationSelect}
                  onClose={() => setShowLocationSearch(false)}
                  currentLocation={currentLocation}
                  onClearLocation={clearLocation}
                />
              </div>
            )}
          </div>
        </div>

        <CategoryFilter 
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg">Caricamento...</div>
            </div>
          ) : transformedContents.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-600">
                  {transformedContents.length} risultat{transformedContents.length === 1 ? 'o' : 'i'} trovat{transformedContents.length === 1 ? 'o' : 'i'}
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transformedContents.map((content) => (
                  <Link key={content.id} to={`/content/${content.id}`}>
                    <ContentCard content={content} />
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-4">Nessun risultato trovato</p>
              <p className="text-gray-500">Prova a modificare i filtri di ricerca</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Search;
