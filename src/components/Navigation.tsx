
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { usePWA } from "@/hooks/usePWA";
import { useAppTexts } from "@/hooks/useAppTexts";
import { useBranding } from "@/hooks/useBranding";
import { Menu, X, Download, Store } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  const { user, profile, signOut } = useAuth();
  const { showInstallButton, installApp } = usePWA();
  const { getText } = useAppTexts();
  const { getSetting } = useBranding();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsOpen(false);
  };

  const handleDashboardClick = () => {
    if (profile?.role === 'admin') {
      navigate("/admin-dashboard");
    } else if (profile?.role === 'provider') {
      navigate("/provider-dashboard");
    } else {
      navigate("/dashboard");
    }
    setIsOpen(false);
  };

  const handleBecomeProviderClick = () => {
    if (user) {
      navigate("/provider-dashboard");
    } else {
      navigate("/auth");
    }
    setIsOpen(false);
  };

  const logoUrl = getSetting('logo_url');
  const siteTitle = getText('site.title', 'Glinda');

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              {logoUrl ? (
                <img 
                  src={logoUrl} 
                  alt={siteTitle}
                  className="h-8 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null}
              <span className="text-xl font-bold text-blue-600">
                {siteTitle}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              {getText('nav.home', 'Home')}
            </Link>
            
            {/* Diventa Partner Link */}
            <Button
              variant="outline"
              onClick={handleBecomeProviderClick}
              className="flex items-center gap-2"
            >
              <Store className="h-4 w-4" />
              Diventa Partner
            </Button>

            {showInstallButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={installApp}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Installa App
              </Button>
            )}
            {user ? (
              <>
                <Button variant="outline" onClick={handleDashboardClick}>
                  {getText('nav.dashboard', 'Dashboard')}
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  Esci
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button>{getText('nav.login', 'Accedi')}</Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">
            {showInstallButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={installApp}
                className="mr-2"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-4 mt-4">
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-blue-600"
                    onClick={() => setIsOpen(false)}
                  >
                    {getText('nav.home', 'Home')}
                  </Link>
                  
                  {/* Diventa Partner Link Mobile */}
                  <Button
                    variant="outline"
                    onClick={handleBecomeProviderClick}
                    className="flex items-center gap-2 justify-start"
                  >
                    <Store className="h-4 w-4" />
                    Diventa Partner
                  </Button>

                  {user ? (
                    <>
                      <Button variant="outline" onClick={handleDashboardClick}>
                        {getText('nav.dashboard', 'Dashboard')}
                      </Button>
                      <Button variant="outline" onClick={handleSignOut}>
                        Esci
                      </Button>
                    </>
                  ) : (
                    <Link to="/auth" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">{getText('nav.login', 'Accedi')}</Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
