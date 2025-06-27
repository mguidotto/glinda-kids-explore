
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src="/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png" 
              alt="Glinda" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Chi siamo</h1>
          <p className="text-lg text-gray-600">
            Il marketplace che connette genitori consapevoli con i migliori servizi educativi
          </p>
        </div>
        
        <div className="prose prose-lg mx-auto">
          <p>
            Glinda nasce dalla passione per l'educazione e dalla convinzione che ogni bambino meriti 
            le migliori opportunità di crescita e apprendimento.
          </p>
          
          <p>
            La nostra piattaforma permette ai genitori di scoprire, confrontare e prenotare 
            facilmente servizi educativi di qualità nella propria zona, mentre offre ai provider 
            un canale efficace per raggiungere nuove famiglie.
          </p>
          
          <h2>La nostra missione</h2>
          <p>
            Rendere l'educazione di qualità accessibile a tutti i bambini, creando un ponte 
            tra famiglie e educatori attraverso la tecnologia.
          </p>
          
          <h2>I nostri valori</h2>
          <ul>
            <li><strong>Qualità:</strong> Solo provider verificati e servizi di alta qualità</li>
            <li><strong>Trasparenza:</strong> Informazioni chiare su prezzi, modalità e recensioni</li>
            <li><strong>Fiducia:</strong> Un ambiente sicuro per famiglie e provider</li>
            <li><strong>Innovazione:</strong> Tecnologia al servizio dell'educazione</li>
          </ul>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
