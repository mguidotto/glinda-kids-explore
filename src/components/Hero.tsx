
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-pink-50 to-purple-100 opacity-60" />
      
      {/* Content */}
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Scopri il meglio per
            <span className="block bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              i tuoi bambini
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Il marketplace che aiuta i genitori a trovare corsi, eventi e servizi educativi 
            di qualità per bambini da 0 a 10 anni. Confronta, prenota e scopri le migliori opportunità vicino a te.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button size="lg" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg px-8 py-3">
            Inizia la Ricerca
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-8 py-3">
            Sei un Provider?
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>4.8/5 stelle da 12k+ genitori</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <span>1,247 contenuti verificati</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-500" />
            <span>Presente in tutta Italia</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
