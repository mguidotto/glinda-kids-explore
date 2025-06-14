
import { Search, MapPin, Calendar, Users, Star, Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import CategoryFilter from "@/components/CategoryFilter";
import ContentCard from "@/components/ContentCard";
import Hero from "@/components/Hero";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Demo content data
  const featuredContent = [
    {
      id: 1,
      title: "Corso Preparto Completo",
      description: "Un percorso di 8 incontri per prepararsi al meglio al parto e all'arrivo del bambino",
      category: "corsi",
      ageGroup: "0-12m",
      price: 180,
      location: "Milano Centro",
      rating: 4.8,
      reviews: 24,
      image: "/placeholder.svg",
      mode: "presenza",
      provider: "Centro Nascita Serena"
    },
    {
      id: 2,
      title: "Spettacolo per Bambini - Il Piccolo Principe",
      description: "Spettacolo teatrale interattivo per bambini dai 3 ai 8 anni",
      category: "eventi",
      ageGroup: "3-6a",
      price: 15,
      location: "Teatro San Marco, Roma",
      rating: 4.9,
      reviews: 156,
      image: "/placeholder.svg",
      mode: "presenza",
      provider: "Teatro dell'Opera dei Burattini"
    },
    {
      id: 3,
      title: "Nido Bilingue Montessori",
      description: "Nido d'infanzia con metodo Montessori e approccio bilingue italiano-inglese",
      category: "servizi",
      ageGroup: "1-3a",
      price: 650,
      location: "Torino",
      rating: 4.7,
      reviews: 43,
      image: "/placeholder.svg",
      mode: "presenza",
      provider: "Nido Piccoli Esploratori"
    },
    {
      id: 4,
      title: "Campus Estivo Natura e Avventura",
      description: "Centro estivo immerso nella natura con attività outdoor e laboratori creativi",
      category: "centri-estivi",
      ageGroup: "6-10a",
      price: 280,
      location: "Parco delle Madonie",
      rating: 4.6,
      reviews: 67,
      image: "/placeholder.svg",
      mode: "presenza",
      provider: "Avventura Verde"
    }
  ];

  const categories = [
    { id: "all", name: "Tutti", count: 1247 },
    { id: "corsi", name: "Corsi", count: 340 },
    { id: "servizi", name: "Servizi Educativi", count: 189 },
    { id: "eventi", name: "Eventi", count: 523 },
    { id: "centri", name: "Centri & Associazioni", count: 95 },
    { id: "centri-estivi", name: "Centri Estivi", count: 100 }
  ];

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
              <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
                Cerca
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </section>

      {/* Featured Content */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">In Evidenza</h2>
          <Button variant="outline">Vedi Tutti</Button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredContent.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">1,247</div>
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
                <li>Corsi</li>
                <li>Servizi Educativi</li>
                <li>Eventi</li>
                <li>Centri Estivi</li>
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
