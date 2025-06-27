
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useAppTexts } from "@/hooks/useAppTexts";
import { Heart, Users, Award, Target } from "lucide-react";

const About = () => {
  const { getText } = useAppTexts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50">
      <Navigation />
      <div className="max-w-4xl mx-auto pt-8 px-4 pb-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {getText('about.title', 'Chi Siamo')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {getText('about.content', 'Siamo la piattaforma di riferimento per genitori che cercano le migliori attività per i loro bambini.')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6">
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Con Amore</h3>
              <p className="text-gray-600 text-sm">Ogni attività è selezionata con cura per il benessere dei bambini</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Comunità</h3>
              <p className="text-gray-600 text-sm">Una rete di famiglie e professionisti che condividono la passione per l'educazione</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6">
              <Award className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Qualità</h3>
              <p className="text-gray-600 text-sm">Partner verificati e attività di alta qualità per garantire le migliori esperienze</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="pt-6">
              <Target className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Obiettivi</h3>
              <p className="text-gray-600 text-sm">Aiutare ogni bambino a scoprire e sviluppare i propri talenti</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">La Nostra Missione</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Crediamo che ogni bambino meriti di vivere esperienze indimenticabili che lo aiutino a crescere, 
                imparare e divertirsi. La nostra piattaforma connette genitori attenti con i migliori provider 
                di attività educative e ricreative.
              </p>
              <p className="mb-4">
                Dal nuoto alla danza, dall'arte allo sport, offriamo una vasta gamma di opportunità per bambini 
                di tutte le età. Ogni partner è accuratamente selezionato e verificato per garantire standard 
                di qualità elevati.
              </p>
              <p>
                Glinda non è solo una piattaforma di prenotazione: è una comunità dove famiglie e educatori 
                si incontrano per creare un futuro migliore per i nostri bambini.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default About;
