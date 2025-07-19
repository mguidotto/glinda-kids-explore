import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import LocationSearch from "@/components/LocationSearch";
import ContentCard from "@/components/ContentCard";
import SearchMapView from "@/components/SearchMapView";
import { useContents } from "@/hooks/useContents";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { MapPin, X, Grid, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
    address?: string;
  } | null>(null);

  const { contents, categories, loading, fetchContents } = useContents();
  const { trackEvent } = useGoogleAnalytics();

  // Find the current category
  const currentCategory = categories.find(cat => cat.slug === slug);

  // SEO dinamico per la pagina categoria
  useSEO({
    title: currentCategory 
      ? `${currentCategory.name} - Attività per Bambini | Glinda`
      : 'Categoria non trovata | Glinda',
    description: currentCategory
      ? `Scopri tutte le attività di ${currentCategory.name.toLowerCase()} per bambini da 0 a 10 anni. Corsi, laboratori, eventi e servizi educativi verificati.`
      : 'La categoria richiesta non è stata trovata.',
    keywords: currentCategory ? `${currentCategory.name}, attività bambini, corsi bambini, eventi bambini` : '',
    canonical: `https://www.glinda.it/${slug}`
  });

  useEffect(() => {
    if (slug) {
      fetchContents({
        category: slug,
        search: searchQuery || undefined,
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
        radius: 50
      });
    }
  }, [slug, searchQuery, currentLocation]);

  // Se la categoria non esiste, redirect alla 404
  if (!loading && categories.length > 0 && !currentCategory) {
    return <Navigate to="/404" replace />;
  }

  const transformedContents = contents.map((content: any) => ({
    id: content.id,
    title: content.title || "",
    description: content.description || "",
    category: content.categories ? { 
      name: content.categories.name, 
      color: content.categories.color,
      slug: content.categories.slug 
    } : null,
    ageGroup: content.age_groups?.join(", ") || "",
    location: content.city || "",
    address: content.address,
    latitude: content.latitude,
    longitude: content.longitude,
    price: { from: content.price_from, to: content.price_to },
    image: content.featured_image || content.images?.[0] || "/placeholder.svg",
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
    // Track search event in category
    if (query) {
      trackEvent('search', {
        search_term: query,
        category: slug
      });
    }
  };

  const handleLocationSelect = (latitude: number, longitude: number, address?: string) => {
    setCurrentLocation({ latitude, longitude, address });
    setShowLocationSearch(false);
    // Track location search usage
    trackEvent('location_search', {
      has_address: !!address,
      category: slug
    });
  };

  const clearLocation = () => {
    setCurrentLocation(null);
    trackEvent('location_cleared', { category: slug });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="text-lg">Caricamento...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {currentCategory?.name || 'Categoria'}
          </h1>
          {currentCategory?.description && (
            <p className="text-gray-600 mb-6">{currentCategory.description}</p>
          )}
          
          <div className="space-y-4">
            <SearchBar onSearch={handleSearch} initialValue={searchQuery} />
            
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowLocationSearch(!showLocationSearch)}
                  className="flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  {currentLocation ? 'Modifica posizione' : 'Cerca vicino a me'}
                </Button>

                {currentLocation && (
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
                )}
              </div>

              {/* View mode toggle */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-2 transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                  Griglia
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className={`flex items-center gap-2 transition-all ${
                    viewMode === 'map' 
                      ? 'bg-white shadow-sm text-gray-900' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <Map className="h-4 w-4" />
                  Mappa
                </Button>
              </div>
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

        <section className="mt-8" aria-labelledby="category-results-heading">
          {transformedContents.length > 0 ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 id="category-results-heading" className="text-xl font-semibold text-gray-900">
                  {transformedContents.length} risultat{transformedContents.length === 1 ? 'o' : 'i'} trovat{transformedContents.length === 1 ? 'o' : 'i'}
                </h2>
              </div>
              
              {viewMode === 'map' ? (
                <SearchMapView 
                  contents={transformedContents}
                  className="w-full h-96 mb-6"
                />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {transformedContents.map((content) => (
                    <ContentCard 
                      key={content.id}
                      id={content.id}
                      title={content.title}
                      description={content.description}
                      category={content.category}
                      location={content.location}
                      address={content.address}
                      latitude={content.latitude}
                      longitude={content.longitude}
                      price={content.price}
                      image={content.image}
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
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-lg text-gray-600 mb-4">Nessun risultato trovato</h2>
              <p className="text-gray-500">Non ci sono attività in questa categoria al momento</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CategoryPage;