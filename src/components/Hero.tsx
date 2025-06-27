
import { Search, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/SearchBar";
import { useAppTexts } from "@/hooks/useAppTexts";

interface HeroProps {
  onSearch: (query: string) => void;
  onExploreActivities: () => void;
}

const Hero = ({ onSearch, onExploreActivities }: HeroProps) => {
  const { getText } = useAppTexts();

  return (
    <section className="relative bg-gradient-to-br from-[#8B4A6B] via-[#7BB3BD] to-[#F4D03F] py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      
      <div className="relative max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {getText('hero.title', 'Trova le migliori attività per i tuoi bambini')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            {getText('hero.subtitle', 'Scopri esperienze uniche, corsi educativi e momenti di gioia per tutta la famiglia')}
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-2xl">
          <SearchBar onSearch={onSearch} placeholder="Cerca attività, corsi, eventi..." />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-white text-[#8B4A6B] hover:bg-white/90 font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={onExploreActivities}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            {getText('hero.explore', 'Esplora Attività')}
          </Button>
          
          <Button 
            variant="ghost" 
            size="lg" 
            className="text-white hover:bg-white/20 font-semibold px-8 py-3 rounded-full transition-all duration-300"
          >
            <MapPin className="mr-2 h-5 w-5" />
            {getText('hero.near_me', 'Vicino a Me')}
          </Button>
        </div>
      </div>

      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-white/5 rounded-full blur-lg"></div>
    </section>
  );
};

export default Hero;
