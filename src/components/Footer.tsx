
import { Link } from "react-router-dom";
import { useAppTexts } from "@/hooks/useAppTexts";
import { useContents } from "@/hooks/useContents";
import { useEffect } from "react";

const Footer = () => {
  const { getText } = useAppTexts();
  const { categories, fetchCategories } = useContents();

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-[#F4D03F]">Glinda</h3>
            <p className="text-gray-300">{getText('footer.description', 'La piattaforma per genitori consapevoli.')}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{getText('footer.categories', 'Categorie')}</h4>
            <ul className="space-y-2 text-gray-300">
              {categories.slice(0, 4).map((category) => (
                <li key={category.id}>
                  <Link 
                    to={`/search?category=${category.slug}`} 
                    className="hover:text-[#7BB3BD]"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{getText('footer.support', 'Supporto')}</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/contact" className="hover:text-[#7BB3BD]">{getText('footer.contact', 'Contattaci')}</Link></li>
              <li><Link to="/about" className="hover:text-[#7BB3BD]">Chi Siamo</Link></li>
              <li><Link to="/privacy" className="hover:text-[#7BB3BD]">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{getText('footer.partner', 'Partner')}</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/contact" className="hover:text-[#7BB3BD]">{getText('footer.become_partner', 'Diventa Partner')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Glinda. {getText('footer.rights', 'Tutti i diritti riservati.')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
