
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, Check, X, MessageSquare } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"] & {
  profiles?: { first_name: string; last_name: string; email: string };
  contents?: { title: string };
};

const ReviewsManagement = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles!reviews_user_id_fkey(first_name, last_name, email),
        contents(title)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const validateReview = async (reviewId: string, validated: boolean) => {
    const { error } = await supabase
      .from("reviews")
      .update({
        validated,
        validated_at: validated ? new Date().toISOString() : null,
        validated_by: validated ? user?.id : null
      })
      .eq("id", reviewId);

    if (error) {
      console.error("Error updating review:", error);
      setMessage("Errore nell'aggiornamento della recensione");
    } else {
      setMessage(`Recensione ${validated ? 'approvata' : 'rifiutata'} con successo`);
      fetchReviews();
    }

    setTimeout(() => setMessage(null), 3000);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return <div>Caricamento recensioni...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Gestione Recensioni
        </CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nessuna recensione trovata</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{review.contents?.title}</h4>
                    <p className="text-sm text-gray-600">
                      di {review.profiles?.first_name} {review.profiles?.last_name}
                      {" "}({review.profiles?.email})
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">{renderStars(review.rating || 0)}</div>
                      <Badge
                        variant={review.validated ? "default" : "secondary"}
                        className={review.validated ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {review.validated ? "Approvata" : "In Attesa"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!review.validated && (
                      <Button
                        size="sm"
                        onClick={() => validateReview(review.id, true)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approva
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => validateReview(review.id, false)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-1" />
                      {review.validated ? "Rimuovi" : "Rifiuta"}
                    </Button>
                  </div>
                </div>
                
                {review.title && (
                  <h5 className="font-medium mb-2">{review.title}</h5>
                )}
                {review.comment && (
                  <p className="text-gray-700 mb-2">{review.comment}</p>
                )}
                
                <p className="text-xs text-gray-500">
                  Creata il {new Date(review.created_at || '').toLocaleDateString('it-IT')}
                  {review.validated_at && (
                    <span> • Validata il {new Date(review.validated_at).toLocaleDateString('it-IT')}</span>
                  )}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsManagement;
