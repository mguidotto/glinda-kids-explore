
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MessageSquare } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"] & {
  profiles?: { first_name: string; last_name: string };
};

interface ReviewsListProps {
  contentId: string;
}

const ReviewsList = ({ contentId }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [contentId]);

  const fetchReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles(first_name, last_name)
      `)
      .eq("content_id", contentId)
      .eq("validated", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
    } else {
      setReviews(data || []);
    }
    setLoading(false);
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

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  if (loading) {
    return <div>Caricamento recensioni...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Recensioni ({reviews.length})
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 ml-4">
              <div className="flex">{renderStars(Math.round(parseFloat(getAverageRating())))}</div>
              <span className="text-lg font-bold">{getAverageRating()}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              Nessuna recensione ancora. Sii il primo a lasciare una recensione!
            </p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {review.profiles?.first_name?.[0]}{review.profiles?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {review.profiles?.first_name} {review.profiles?.last_name}
                      </span>
                      <div className="flex">{renderStars(review.rating || 0)}</div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.created_at || '').toLocaleDateString('it-IT')}
                      </span>
                    </div>
                    {review.title && (
                      <h4 className="font-semibold mb-2">{review.title}</h4>
                    )}
                    {review.comment && (
                      <p className="text-gray-700">{review.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewsList;
