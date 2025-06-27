
import Navigation from "@/components/Navigation";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contattaci</h1>
          <p className="text-lg text-gray-600">
            Hai domande o suggerimenti? Siamo qui per aiutarti!
          </p>
        </div>
        
        <ContactForm />
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Altre informazioni</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">ciao@glinda.it</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Supporto</h3>
              <p className="text-gray-600">Ti risponderemo entro 24 ore</p>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Contact;
