
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import UserMenu from "@/components/UserMenu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();

  console.log("Navigation render - Loading:", loading, "User:", !!user);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png" 
              alt="Glinda - Logo dell'app per attività bambini" 
              className="h-8 w-auto"
              width="32"
              height="32"
              loading="eager"
            />
            <span className="text-xl font-bold text-[#8B4A6B]">Glinda</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-gray-700 hover:text-[#8B4A6B] transition-colors">
              Cerca
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-[#8B4A6B] transition-colors">
              Chi Siamo
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#8B4A6B] transition-colors">
              Contatti
            </Link>
            
            {loading ? (
              <>
                {console.log("Rendering loading state (desktop)")}
                <div className="w-20 h-10 bg-gray-200 animate-pulse rounded" aria-label="Caricamento menu utente"></div>
              </>
            ) : user ? (
              <>
                {console.log("Rendering UserMenu (desktop)")}
                <UserMenu />
              </>
            ) : (
              <>
                {console.log("Rendering Collabora con noi button (desktop)")}
                <Link to="/contact">
                  <Button 
                    className="bg-gradient-to-r from-[#8B4A6B] to-[#7BB3BD] hover:from-[#7A4060] hover:to-[#6BA3AD]"
                    aria-label="Collabora con noi"
                  >
                    Collabora con noi
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Chiudi menu di navigazione" : "Apri menu di navigazione"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-2" id="mobile-menu">
            <Link 
              to="/search" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Cerca
            </Link>
            <Link 
              to="/about" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Chi Siamo
            </Link>
            <Link 
              to="/contact" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Contatti
            </Link>
            
            {loading ? (
              <>
                {console.log("Rendering loading state (mobile)")}
                <div className="px-4 py-2">
                  <div className="w-full h-10 bg-gray-200 animate-pulse rounded" aria-label="Caricamento menu utente"></div>
                </div>
              </>
            ) : user ? (
              <>
                {console.log("Rendering UserMenu (mobile)")}
                <div className="px-4 py-2">
                  <UserMenu />
                </div>
              </>
            ) : (
              <>
                {console.log("Rendering Collabora con noi button (mobile)")}
                <Link 
                  to="/contact"
                  className="block px-4 py-2 text-white bg-gradient-to-r from-[#8B4A6B] to-[#7BB3BD] rounded-lg transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                  aria-label="Collabora con noi"
                >
                  Collabora con noi
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
