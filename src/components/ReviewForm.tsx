
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, AlertCircle, Camera } from "lucide-react";
import { useCapacitor } from "@/hooks/useCapacitor";

interface ReviewFormProps {
  contentId: string;
}

const generateRandomName = () => {
  const adjectives = ['Felice', 'Entusiasta', 'Soddisfatto', 'Curioso', 'Avventuroso', 'Creativo', 'Amichevole', 'Gentile'];
  const nouns = ['Genitore', 'Mamma', 'Papà', 'Famiglia', 'Visitatore', 'Cliente', 'Utente', 'Ospite'];
  
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNumber = Math.floor(Math.random() * 1000);
  
  return `${randomAdjective}${randomNoun}${randomNumber}`;
};

const ReviewForm = ({ contentId }: ReviewFormProps) => {
  const { user } = useAuth();
  const { isNative, takePicture } = useCapacitor();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePhotoCapture = async () => {
    if (!isNative) {
      setError("La funzione fotocamera è disponibile solo nell'app mobile");
      return;
    }

    try {
      const photo = await takePicture();
      if (photo?.dataUrl) {
        setPhotos(prev => [...prev, photo.dataUrl!]);
      }
    } catch (error) {
      console.error('Errore durante la cattura della foto:', error);
      setError("Errore durante la cattura della foto");
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (rating === 0) {
        setError("Per favore seleziona una valutazione");
        return;
      }

      // Check if user already has a review for this content
      if (user) {
        const { data: existingReview } = await supabase
          .from("reviews")
          .select("id")
          .eq("content_id", contentId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (existingReview) {
          setError("Hai già lasciato una recensione per questo contenuto");
          return;
        }
      }

      // Generate random name if not provided and user is not logged in
      let finalReviewerName = reviewerName;
      if (!user && !reviewerName.trim()) {
        finalReviewerName = generateRandomName();
      }

      const reviewData = {
        content_id: contentId,
        user_id: user?.id || null,
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null,
        reviewer_name: finalReviewerName.trim() || null,
        photos: photos.length > 0 ? photos : null,
        validated: false
      };

      console.log("Submitting review:", reviewData);

      const { error: submitError } = await supabase
        .from("reviews")
        .insert([reviewData]);

      if (submitError) {
        console.error("Errore durante l'invio della recensione:", submitError);
        
        // Check for duplicate key error
        if (submitError.code === '23505') {
          setError("Hai già lasciato una recensione per questo contenuto");
        } else {
          setError(`Errore durante l'invio della recensione: ${submitError.message}`);
        }
        return;
      }

      setSuccess(true);
      
      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
      setReviewerName("");
      setPhotos([]);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Errore imprevisto:", error);
      setError("Si è verificato un errore imprevisto. Riprova più tardi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-6">
          <Alert>
            <AlertDescription>
              Grazie per la tua recensione! Sarà pubblicata dopo la verifica da parte del nostro team.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Lascia una Recensione</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Rating */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Valutazione *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= rating 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name (only for non-logged users) */}
          {!user && (
            <div className="space-y-2">
              <Label htmlFor="reviewer-name" className="text-sm font-medium">
                Nome (opzionale)
              </Label>
              <Input
                id="reviewer-name"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="Il tuo nome o lascia vuoto per un nome casuale"
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Se lasci vuoto, verrà generato un nome casuale per proteggere la tua privacy
              </p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="review-title" className="text-sm font-medium">
              Titolo (opzionale)
            </Label>
            <Input
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Riassumi la tua esperienza"
              className="w-full"
            />
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <Label htmlFor="review-comment" className="text-sm font-medium">
              Commento (opzionale)
            </Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Condividi la tua esperienza..."
              rows={4}
              className="w-full resize-none"
            />
          </div>

          {/* Photo capture (only for native apps) */}
          {isNative && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Foto (opzionale)</Label>
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePhotoCapture}
                  className="w-full"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Scatta una foto
                </Button>
                
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isSubmitting ? "Invio in corso..." : "Invia Recensione"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
