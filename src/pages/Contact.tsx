
import Navigation from "@/components/Navigation";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useAppTexts } from "@/hooks/useAppTexts";

const Contact = () => {
  const { getText } = useAppTexts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <Navigation />
      <div className="max-w-4xl mx-auto pt-8 px-4 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {getText('contact.title', 'Contattaci')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {getText('contact.subtitle', 'Hai domande o vuoi maggiori informazioni? Siamo qui per aiutarti!')}
          </p>
        </div>

        <ContactForm />
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
