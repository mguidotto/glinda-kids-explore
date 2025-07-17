
import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import MobileLayout from '../components/MobileLayout';
import { useMobile } from '../hooks/use-mobile';

const Terms = () => {
  const isMobile = useMobile();

  const content = (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Termini e Condizioni</h1>
        <div className="prose max-w-none">
          <p className="mb-4">
            Benvenuto sulla nostra piattaforma. I seguenti termini e condizioni governano l'uso dei nostri servizi.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">1. Accettazione dei Termini</h2>
          <p className="mb-4">
            Utilizzando questo sito web, accetti di essere vincolato da questi termini e condizioni.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">2. Uso del Servizio</h2>
          <p className="mb-4">
            Il servizio è fornito per uso personale e non commerciale. È vietato utilizzare il servizio per scopi illegali.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">3. Privacy</h2>
          <p className="mb-4">
            La tua privacy è importante per noi. Consulta la nostra Privacy Policy per informazioni su come trattiamo i tuoi dati.
          </p>
          <h2 className="text-2xl font-semibold mt-6 mb-4">4. Modifiche</h2>
          <p className="mb-4">
            Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche saranno efficaci immediatamente dopo la pubblicazione.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );

  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  return content;
};

export default Terms;
