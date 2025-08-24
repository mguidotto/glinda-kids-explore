
import { Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { useAppTexts } from "@/hooks/useAppTexts";

interface HeroProps {
  onSearch: (query: string) => void;
  onExploreActivities: () => void;
}

const Hero = ({ onSearch, onExploreActivities }: HeroProps) => {
  const { getText } = useAppTexts();

  const handleExploreClick = () => {
    console.log('Explore activities clicked - calling onExploreActivities');
    onExploreActivities();
  };

  return (
    <section className="relative bg-gradient-to-br from-[#8B4A6B] via-[#7BB3BD] to-[#F4D03F] py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="mb-8">
          {/* Ottimizzazione LCP: ridotto font-size iniziale e ottimizzato rendering */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight will-change-transform">
            {getText('hero.title', 'Trova le migliori attività per i tuoi bambini')}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
            {getText('hero.subtitle', 'Scopri esperienze uniche, corsi educativi e momenti di gioia per tutta la famiglia')}
          </p>
        </div>

      </div>

      {/* Elementi decorativi con aria-hidden */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" aria-hidden="true"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl" aria-hidden="true"></div>
      <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-lg" aria-hidden="true"></div>
    </section>
  );
};

export default Hero;
