
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
      "Full URL:",
      window.location.href,
      "Referrer:",
      document.referrer
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader>
            <div className="text-6xl font-bold text-[#8B4A6B] mb-4">404</div>
            <CardTitle className="text-2xl mb-2">Pagina non trovata</CardTitle>
            <p className="text-gray-600">
              La pagina che stai cercando non esiste o è stata spostata.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Link to="/">
                <Button className="w-full bg-gradient-to-r from-[#8B4A6B] to-[#7BB3BD] hover:from-[#7A4060] hover:to-[#6BA3AD]">
                  <Home className="h-4 w-4 mr-2" />
                  Torna alla Homepage
                </Button>
              </Link>
              
              <Link to="/search">
                <Button variant="outline" className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Cerca Attività
                </Button>
              </Link>
              
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Torna Indietro
              </Button>
            </div>
            
            <div className="text-sm text-gray-500 mt-6">
              <p>Se pensi che questo sia un errore, puoi:</p>
              <ul className="mt-2 space-y-1">
                <li>• Controllare l'URL per eventuali errori di battitura</li>
                <li>• Usare la ricerca per trovare quello che cerchi</li>
                <li>• Contattarci se il problema persiste</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
