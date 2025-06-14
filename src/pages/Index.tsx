
import { Search, MapPin, Calendar, Users, Star, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import CategoryFilter from "@/components/CategoryFilter";
import ContentCard from "@/components/ContentCard";
import Hero from "@/components/Hero";
import { useContents } from "@/hooks/useContents";
import { Database } from "@/integrations/supabase/types";

type Content = Database["public"]["Tables"]["contents"]["Row"] & {
  providers: { business_name: string; verified: boolean };
  categories: { name: string; slug: string };
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { contents, categories, loading, fetchContents } = useContents();

  useEffect(() => {
    fetchContents({ 
      category: selectedCategory === "all" ? undefined : selectedCategory,
      search: searchQuery || undefined 
    });
  }, [selectedCategory, searchQuery]);

  // Transform categories for CategoryFilter component
  const categoryOptions = [
    { id: "all", name: "Tutti", count: contents.length },
    ...categories.map(cat => ({
      id: cat.slug,
      name: cat.name,
      count: contents.filter(c => (c as any).categories?.slug === cat.slug).length
    }))
  ];

  // Transform contents for ContentCard component
  const transformedContents = contents.map((content: Content) => ({
    id: content.id,
    title: content.title || "",
    description: content.description || "",
    category: (content as any).categories?.slug || "",
    ageGroup: content.age_groups?.[0] || "1-3a",
    price: content.price_from || 0,
    location: content.city || "",
    rating: 4.8, // Mock data for now
    reviews: 24, // Mock data for now
    image: "/placeholder.svg",
    mode: content.modality === "presenza" ? "presenza" : "online",
    provider: (content as any).providers?.business_name || "Provider"
  }));

  const handleSearch = () => {
    fetchContents({ 
      category: selectedCategory === "all" ? undefined : selectedCategory,
      search: searchQuery || undefined 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <Navigation />
      
      <Hero />

      {/* Search Section */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 -mt-8 relative z-10">
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
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Località
              </Button>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtri
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                onClick={handleSearch}
              >
                Cerca
              </Button>
            </div>
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

      {/* Featured Content */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Contenuti Disponibili</h2>
          <Button variant="outline">Vedi Tutti</Button>
        </div>
        
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {transformedContents.map((content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        )}

        {!loading && transformedContents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nessun contenuto trovato per la ricerca corrente.</p>
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">{contents.length}</div>
              <div className="text-gray-600">Contenuti Disponibili</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600 mb-2">12,450</div>
              <div className="text-gray-600">Genitori Registrati</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">8,340</div>
              <div className="text-gray-600">Prenotazioni Completate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">4.8</div>
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
              <h3 className="text-xl font-bold mb-4 text-orange-400">Glinda</h3>
              <p className="text-gray-300">Il marketplace per genitori consapevoli.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categorie</h4>
              <ul className="space-y-2 text-gray-300">
                {categories.slice(0, 4).map(cat => (
                  <li key={cat.id}>{cat.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Supporto</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Centro Assistenza</li>
                <li>Contattaci</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Partner</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Diventa Partner</li>
                <li>Area Partner</li>
                <li>Pubblicità</li>
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
