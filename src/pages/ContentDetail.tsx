
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Share2, MapPin, Calendar, Clock, Users, Star, Euro, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import ReviewsList from "@/components/ReviewsList";
import ReviewForm from "@/components/ReviewForm";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Content = Database["public"]["Tables"]["contents"]["Row"] & {
  providers: { business_name: string; verified: boolean };
  categories: { name: string; slug: string };
};

const ContentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("contents")
        .select(`
          *,
          providers!inner(business_name, verified),
          categories!inner(name, slug)
        `)
        .eq("id", id)
        .eq("published", true)
        .single();

      if (!error && data) {
        setContent(data as Content);
      }
      setLoading(false);
    };

    fetchContent();
  }, [id]);

  const handleReviewSubmitted = () => {
    // This will trigger a re-fetch of reviews in the ReviewsList component
    window.location.reload();
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>Caricamento...</div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>Contenuto non trovato</div>
        </div>
      </div>
    );
  }

  const shouldShowBooking = content.content_type !== 'centro' && content.booking_required;
  const shouldShowPrice = content.content_type !== 'centro' && content.price_from && content.payment_type !== 'free';
  const isBookableService = content.content_type === 'corso' || content.content_type === 'evento';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" className="mb-6" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna ai risultati
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <div className="grid grid-cols-3 gap-2">
              <img 
                src={content.images?.[0] || "/placeholder.svg"} 
                alt={content.title}
                className="col-span-2 w-full h-64 object-cover rounded-lg"
              />
              <div className="space-y-2">
                <img 
                  src={content.images?.[1] || "/placeholder.svg"} 
                  alt={content.title}
                  className="w-full h-31 object-cover rounded-lg"
                />
                <img 
                  src={content.images?.[2] || "/placeholder.svg"} 
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
                        {content.city}
                      </div>
                      <Badge className="capitalize">
                        {(content as any).categories?.name}
                      </Badge>
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
                
                {/* Contact info */}
                <div className="space-y-2 text-sm text-gray-600">
                  {content.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{content.address}</span>
                    </div>
                  )}
                  {content.phone && (
                    <div>
                      <strong>Telefono:</strong> {content.phone}
                    </div>
                  )}
                  {content.email && (
                    <div>
                      <strong>Email:</strong> {content.email}
                    </div>
                  )}
                  {content.website && (
                    <div>
                      <strong>Sito web:</strong> 
                      <a href={content.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                        {content.website}
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            <ReviewsList contentId={id || ""} />
            
            {/* Review Form */}
            <ReviewForm 
              contentId={id || ""} 
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>

          {/* Booking sidebar - only show for bookable content */}
          {(shouldShowBooking || shouldShowPrice) && (
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{shouldShowBooking ? 'Prenota' : 'Info'}</span>
                    {shouldShowPrice && (
                      <div className="flex items-center gap-1">
                        <Euro className="h-5 w-5 text-green-600" />
                        <span className="text-2xl font-bold text-green-600">
                          {content.price_from}€
                          {content.price_to && content.price_to !== content.price_from && (
                            <span className="text-sm"> - {content.price_to}€</span>
                          )}
                        </span>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {content.duration_minutes && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{content.duration_minutes} min</span>
                      </div>
                    )}
                    {content.max_participants && (
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>Max {content.max_participants}</span>
                      </div>
                    )}
                    <Badge className="bg-green-100 text-green-800 capitalize">
                      {content.modality === 'presenza' ? 'In Presenza' : content.modality}
                    </Badge>
                  </div>

                  {shouldShowBooking && (
                    <>
                      <Separator />
                      <Button 
                        className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                        disabled={!isBookableService}
                      >
                        {isBookableService ? 'Prenota Ora' : 'Contatta per Info'}
                      </Button>
                    </>
                  )}

                  <Button variant="outline" className="w-full">
                    Contatta il Provider
                  </Button>

                  {shouldShowBooking && (
                    <div className="text-xs text-gray-500 text-center">
                      Cancellazione gratuita fino a 48h prima
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
