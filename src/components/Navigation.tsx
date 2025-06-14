
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, User, Menu, X, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              Glinda
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-700 hover:text-orange-600 transition-colors">
              Home
            </Link>
            <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors">
              Categorie
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-600 transition-colors">
              Come Funziona
            </a>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4 mr-2" />
                  Preferiti
                </Button>
                
                {profile?.role === 'provider' && (
                  <Link to="/provider-dashboard">
                    <Button variant="outline" size="sm">
                      <Building2 className="h-4 w-4 mr-2" />
                      Dashboard Provider
                    </Button>
                  </Link>
                )}
                
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Il Mio Account
                  </Button>
                </Link>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-gray-600"
                >
                  Esci
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="outline" size="sm">
                    Accedi
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500">
                    Registrati
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-orange-600 py-2">
                Home
              </Link>
              <a href="#" className="text-gray-700 hover:text-orange-600 py-2">
                Categorie
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-600 py-2">
                Come Funziona
              </a>
              
              {user ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-orange-600 py-2">
                    Il Mio Account
                  </Link>
                  {profile?.role === 'provider' && (
                    <Link to="/provider-dashboard" className="text-gray-700 hover:text-orange-600 py-2">
                      Dashboard Provider
                    </Link>
                  )}
                  <button 
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-orange-600 py-2 text-left"
                  >
                    Esci
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link to="/auth">
                    <Button variant="outline" size="sm" className="w-full">
                      Accedi
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-pink-500">
                      Registrati
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
