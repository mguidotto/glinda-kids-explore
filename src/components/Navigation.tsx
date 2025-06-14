
import { useState } from "react";
import { Heart, User, Menu, X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Glinda
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Corsi
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Eventi
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Servizi
            </a>
            <a href="#" className="text-gray-700 hover:text-orange-500 font-medium transition-colors">
              Partner
            </a>
          </div>

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                3
              </Badge>
            </Button>
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4 mr-2" />
              Preferiti
            </Button>
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4 mr-2" />
              Accedi
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600">
              Registrati
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">
                Corsi
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">
                Eventi
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">
                Servizi
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-500 font-medium">
                Partner
              </a>
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                <Button variant="ghost" size="sm" className="justify-start">
                  <Heart className="h-4 w-4 mr-2" />
                  Preferiti
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  <User className="h-4 w-4 mr-2" />
                  Accedi
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-orange-500 to-pink-500">
                  Registrati
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
