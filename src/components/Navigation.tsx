
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getDashboardLink = () => {
    if (!user) return '/auth';
    
    // Check user role from metadata or profile
    return '/dashboard';
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png" 
              alt="Glinda" 
              className="h-8 w-auto"
            />
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
            
            {!loading && (
              user ? (
                <div className="flex items-center space-x-4">
                  <Link to={getDashboardLink()}>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                  >
                    <LogOut className="h-4 w-4" />
                    Esci
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button className="bg-gradient-to-r from-[#8B4A6B] to-[#7BB3BD] hover:from-[#7A4060] hover:to-[#6BA3AD]">
                    Accedi
                  </Button>
                </Link>
              )
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
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
            
            {!loading && (
              user ? (
                <div className="space-y-2">
                  <Link 
                    to={getDashboardLink()}
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Esci
                  </button>
                </div>
              ) : (
                <Link 
                  to="/auth"
                  className="block px-4 py-2 text-white bg-gradient-to-r from-[#8B4A6B] to-[#7BB3BD] rounded-lg transition-colors text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Accedi
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
