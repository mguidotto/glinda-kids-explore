
import ContactForm from "@/components/ContactForm";
import { useAppTexts } from "@/hooks/useAppTexts";
import { useSEO } from "@/hooks/useSEO";

const Contact = () => {
  const { getText } = useAppTexts();

  // SEO ottimizzato per la pagina contatti
  useSEO({
    title: 'Contattaci - Glinda | Assistenza e Supporto per Genitori',
    description: 'Hai domande su Glinda? Contatta il nostro team di supporto per assistenza con attività per bambini, prenotazioni e servizi educativi. Siamo qui per aiutarti!',
    keywords: 'contatti glinda, supporto genitori, assistenza prenotazioni, help desk bambini, contatto marketplace',
    canonical: 'https://glinda.lovable.app/contact'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <main className="max-w-4xl mx-auto pt-8 px-4 pb-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {getText('contact.title', 'Contattaci')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {getText('contact.subtitle', 'Hai domande o vuoi maggiori informazioni? Siamo qui per aiutarti!')}
          </p>
        </header>

        <section aria-labelledby="contact-form-heading">
          <h2 id="contact-form-heading" className="sr-only">Modulo di contatto</h2>
          <ContactForm />
        </section>
      </main>
    </div>
  );
};

export default Contact;
