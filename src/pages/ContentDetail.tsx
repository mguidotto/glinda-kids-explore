import { useState } from "react";
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Clock, Users, Star, Euro, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import ReviewsList from "@/components/ReviewsList";
import ReviewForm from "@/components/ReviewForm";

const ContentDetail = () => {
  const [selectedDate, setSelectedDate] = useState("");

  // Mock data for a course detail
  const content = {
    id: 1,
    title: "Corso Preparto Completo",
    description: "Un percorso di 8 incontri per prepararsi al meglio al parto e all'arrivo del bambino. Il corso include tecniche di respirazione, gestione del dolore, allattamento e cura del neonato.",
    longDescription: "Il nostro corso preparto è pensato per accompagnare le future mamme e papà in questo momento speciale. Durante gli 8 incontri affronteremo tutti gli aspetti fondamentali: dalla preparazione fisica e mentale al parto, alle prime cure del neonato, dall'allattamento al sonno dei bambini. Il corso è condotto da ostetriche qualificate e include anche incontri con pediatri esperti.",
    category: "corsi",
    ageGroup: "0-12m",
    price: 180,
    location: "Centro Nascita Serena, Via Roma 15, Milano",
    rating: 4.8,
    reviews: 24,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    mode: "presenza",
    provider: "Centro Nascita Serena",
    duration: "8 settimane",
    schedule: "Ogni martedì 18:00-20:00",
    maxParticipants: 12,
    features: [
      "8 incontri di 2 ore ciascuno",
      "Materiale didattico incluso",
      "Supporto post-corso",
      "Accesso a gruppo WhatsApp",
      "Certificato di partecipazione"
    ],
    availableDates: [
      { id: 1, date: "2024-02-06", status: "available", remaining: 3 },
      { id: 2, date: "2024-02-20", status: "available", remaining: 7 },
      { id: 3, date: "2024-03-05", status: "available", remaining: 2 }
    ]
  };

  const handleReviewSubmitted = () => {
    // This will trigger a re-fetch of reviews in the ReviewsList component
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna ai risultati
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="grid grid-cols-3 gap-2">
              <img 
                src={content.images[0]} 
                alt={content.title}
                className="col-span-2 w-full h-64 object-cover rounded-lg"
              />
              <div className="space-y-2">
                <img 
                  src={content.images[1]} 
                  alt={content.title}
                  className="w-full h-31 object-cover rounded-lg"
                />
                <img 
                  src={content.images[2]} 
                  alt={content.title}
                  className="w-full h-31 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Content info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{content.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {content.location.split(',')[0]}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        {content.rating} ({content.reviews} recensioni)
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{content.description}</p>
                <p className="text-gray-600">{content.longDescription}</p>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Cosa include</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {content.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <ReviewsList contentId="1" />
            
            {/* Review Form */}
            <ReviewForm 
              contentId="1" 
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Prenota</span>
                  <div className="flex items-center gap-1">
                    <Euro className="h-5 w-5 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">{content.price}€</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{content.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{content.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span>Max {content.maxParticipants}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {content.mode === 'presenza' ? 'In Presenza' : 'Online'}
                  </Badge>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-3">Seleziona data di inizio</h4>
                  <div className="space-y-2">
                    {content.availableDates.map((date) => (
                      <Button
                        key={date.id}
                        variant={selectedDate === date.date ? "default" : "outline"}
                        className="w-full justify-between"
                        onClick={() => setSelectedDate(date.date)}
                      >
                        <span>{new Date(date.date).toLocaleDateString('it-IT')}</span>
                        <Badge variant="secondary" className="text-xs">
                          {date.remaining} posti
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                  disabled={!selectedDate}
                >
                  Prenota Ora
                </Button>

                <Button variant="outline" className="w-full">
                  Contatta il Provider
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  Cancellazione gratuita fino a 48h prima
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
