
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
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
