
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png" 
                alt="Glinda" 
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-300">Il marketplace per genitori consapevoli.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Categorie</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/search?category=servizi-educativi" className="hover:text-[#7BB3BD]">Servizi Educativi</Link></li>
              <li><Link to="/search?category=corsi" className="hover:text-[#7BB3BD]">Corsi</Link></li>
              <li><Link to="/search?category=eventi" className="hover:text-[#7BB3BD]">Eventi</Link></li>
              <li><Link to="/search?category=centri" className="hover:text-[#7BB3BD]">Centri</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Supporto</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/contact" className="hover:text-[#7BB3BD]">Centro Assistenza</Link></li>
              <li><Link to="/contact" className="hover:text-[#7BB3BD]">Contattaci</Link></li>
              <li><Link to="/about" className="hover:text-[#7BB3BD]">Chi siamo</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Partner</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/auth" className="hover:text-[#7BB3BD]">Diventa Partner</Link></li>
              <li><Link to="/provider-dashboard" className="hover:text-[#7BB3BD]">Area Partner</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Glinda. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
