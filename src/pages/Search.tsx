
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import LocationSearch from "@/components/LocationSearch";
import CategoryFilter from "@/components/CategoryFilter";
import ContentCard from "@/components/ContentCard";
import { useContents } from "@/hooks/useContents";
import { useSEO } from "@/hooks/useSEO";
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

  // SEO dinamico per la pagina ricerca
  useSEO({
    title: searchQuery 
      ? `Cerca "${searchQuery}" - Attività per Bambini | Glinda`
      : 'Cerca Attività per Bambini 0-10 anni - Corsi, Eventi e Servizi | Glinda',
    description: searchQuery
      ? `Risultati di ricerca per "${searchQuery}": trova le migliori attività, corsi ed eventi per bambini vicino a te.`
      : 'Trova e prenota le migliori attività educative per bambini da 0 a 10 anni: corsi, laboratori, eventi e servizi educativi verificati.',
    keywords: `ricerca attività bambini, ${searchQuery}, corsi bambini, eventi bambini, servizi educativi`,
    canonical: `https://glinda.lovable.app/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ''}`
  });

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
    category: content.categories ? { name: content.categories.name, color: content.categories.color } : null,
    ageGroup: content.age_groups?.join(", ") || "",
    location: content.city || "",
    price: { from: content.price_from, to: content.price_to },
    image: content.featured_image || content.images?.[0] || "/placeholder.svg",
    rating: 4.5,
    reviews: 24,
    provider: content.providers ? { business_name: content.providers.business_name, verified: content.providers.verified } : null,
    mode: content.modality === 'presenza' ? 'In Presenza' : content.modality,
    distance: content.distance_km,
    purchasable: content.purchasable,
    featured: content.featured,
    slug: content.slug,
    city: content.city,
    modality: content.modality,
    eventDate: content.event_date,
    eventTime: content.event_time,
    eventEndDate: content.event_end_date,
    eventEndTime: content.event_end_time
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
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {searchQuery ? `Risultati per "${searchQuery}"` : 'Cerca Attività per Bambini'}
          </h1>
          
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
        </header>

        <section aria-labelledby="category-filter-heading">
          <h2 id="category-filter-heading" className="sr-only">Filtra per Categoria</h2>
          <CategoryFilter 
            categories={categoryOptions}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </section>

        <section className="mt-8" aria-labelledby="search-results-heading">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-lg">Caricamento...</div>
            </div>
          ) : transformedContents.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 id="search-results-heading" className="text-xl font-semibold text-gray-900">
                  {transformedContents.length} risultat{transformedContents.length === 1 ? 'o' : 'i'} trovat{transformedContents.length === 1 ? 'o' : 'i'}
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {transformedContents.map((content) => (
                  <ContentCard 
                    key={content.id}
                    id={content.id}
                    title={content.title}
                    description={content.description}
                    category={content.category}
                    location={content.location}
                    price={content.price}
                    image={content.image}
                    rating={content.rating}
                    reviews={content.reviews}
                    provider={content.provider}
                    distance={content.distance}
                    purchasable={content.purchasable}
                    featured={content.featured}
                    slug={content.slug}
                    city={content.city}
                    modality={content.modality}
                    eventDate={content.eventDate}
                    eventTime={content.eventTime}
                    eventEndDate={content.eventEndDate}
                    eventEndTime={content.eventEndTime}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-lg text-gray-600 mb-4">Nessun risultato trovato</h2>
              <p className="text-gray-500">Prova a modificare i filtri di ricerca</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Search;
