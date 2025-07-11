
import { useAppTexts } from "@/hooks/useAppTexts";
import { useSEO } from "@/hooks/useSEO";

const Privacy = () => {
  const { getText } = useAppTexts();

  useSEO({
    title: 'Privacy Policy - Glinda | Informativa sulla Privacy',
    description: 'Leggi la nostra informativa sulla privacy per sapere come trattiamo i tuoi dati personali e quali sono i tuoi diritti.',
    keywords: 'privacy policy, informativa privacy, trattamento dati, gdpr, diritti utenti',
    canonical: 'https://glinda.lovable.app/privacy'
  });

  const privacyTitle = getText('privacy.title', 'Privacy Policy');
  const privacyContent = getText('privacy.content', 'Contenuto della Privacy Policy non ancora configurato. Accedi come amministratore per modificare questo testo.');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <main className="max-w-4xl mx-auto pt-8 px-4 pb-16">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {privacyTitle}
          </h1>
        </header>

        <section className="bg-white rounded-lg shadow-lg p-8">
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: privacyContent.replace(/\n/g, '<br />') }}
          />
        </section>
      </main>
    </div>
  );
};

export default Privacy;
