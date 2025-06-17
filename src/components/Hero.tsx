
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Star, Users, MapPin, Search, Award, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementare la ricerca
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="relative py-16 px-4 overflow-hidden bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
      {/* Overlay decorativo */}
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Elementi decorativi flottanti */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300/20 rounded-full blur-lg animate-pulse delay-500" />
      
      {/* Content */}
      <div className="relative max-w-6xl mx-auto text-center text-white">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Scopri il meglio per
            <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
              i tuoi bambini
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
            Il marketplace #1 in Italia per attività educative e ricreative. 
            Trova corsi, eventi e servizi di qualità vicino a te.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2 bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca corsi, attività, città..."
              className="border-0 bg-transparent text-gray-900 text-lg placeholder:text-gray-500 focus-visible:ring-0"
            />
            <Button 
              type="submit" 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-xl px-8"
            >
              <Search className="h-5 w-5 mr-2" />
              Cerca
            </Button>
          </div>
        </form>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-xl font-semibold shadow-lg">
            Esplora Attività
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Link to="/auth">
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 rounded-xl border-2 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm font-semibold">
              Diventa Partner
            </Button>
          </Link>
        </div>

        {/* Trust indicators con design più accattivante */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white/90">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Star className="h-8 w-8 text-yellow-300 mx-auto mb-3 fill-current" />
            <div className="text-2xl font-bold">4.8★</div>
            <div className="text-sm">da 12k+ genitori</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Users className="h-8 w-8 text-blue-300 mx-auto mb-3" />
            <div className="text-2xl font-bold">1,247</div>
            <div className="text-sm">contenuti verificati</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <MapPin className="h-8 w-8 text-green-300 mx-auto mb-3" />
            <div className="text-2xl font-bold">100+</div>
            <div className="text-sm">città coperte</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Award className="h-8 w-8 text-orange-300 mx-auto mb-3" />
            <div className="text-2xl font-bold">500+</div>
            <div className="text-sm">partner certificati</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
