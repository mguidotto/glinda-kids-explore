
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Users, MapPin } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative py-32 px-4 overflow-hidden min-h-[70vh] flex items-center">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/lovable-uploads/1c8fcd18-c580-4fe2-a92a-b1b927fd2024.png')"
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content */}
      <div className="relative max-w-6xl mx-auto w-full">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Ricordi di viaggio
            <span className="block">
              indimenticabili
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-xl">
            Esplora l'architettura modernista di Barcellona
          </p>
          
          {/* CTA Button */}
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-lg px-8 py-4 h-auto"
          >
            Scopri di più
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
