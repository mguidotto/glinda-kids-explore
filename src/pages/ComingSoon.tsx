
import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import MobileLayout from '../components/MobileLayout';
import { useIsMobile } from '../hooks/use-mobile';

const ComingSoon = () => {
  const isMobile = useIsMobile();

  const content = (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Prossimamente</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Questa sezione sarà disponibile a breve. Stiamo lavorando per offrirti la migliore esperienza possibile.
          </p>
          <div className="animate-pulse">
            <div className="w-24 h-24 bg-primary/20 rounded-full mx-auto mb-4"></div>
          </div>
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

export default ComingSoon;
