
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useCapacitor } from "@/hooks/useCapacitor";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Star, MessageSquare, Camera, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ReviewFormProps {
  contentId: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm = ({ contentId, onReviewSubmitted }: ReviewFormProps) => {
  const { user } = useAuth();
  const { isNative, takePicture } = useCapacitor();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Genera un nome casuale per utenti anonimi
  const generateRandomName = () => {
    const names = [
      "Marco", "Giulia", "Andrea", "Francesca", "Matteo", "Sara", "Luca", "Elena",
      "Alessandro", "Chiara", "Lorenzo", "Valeria", "Davide", "Martina", "Federico",
      "Silvia", "Riccardo", "Valentina", "Simone", "Lucia", "Francesco", "Alessia"
    ];
    return names[Math.floor(Math.random() * names.length)];
  };

  const handleTakePhoto = async () => {
    if (!isNative) return;
    
    try {
      const result = await takePicture();
      if (result.dataUrl && !result.error) {
        setPhotos(prev => [...prev, result.dataUrl!]);
        toast({
          title: "Foto aggiunta",
          description: "La foto è stata aggiunta alla recensione"
        });
      } else if (result.error) {
        toast({
          title: "Errore",
          description: `Errore nella foto: ${result.error}`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      toast({
        title: "Errore",
        description: "Errore nell'acquisizione della foto",
        variant: "destructive"
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast({
        title: "Errore",
        description: "Seleziona una valutazione",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // Se l'utente non ha inserito un nome, ne generiamo uno casuale
      const finalReviewerName = reviewerName.trim() || generateRandomName();

      // Prepara i dati della recensione
      const reviewData: any = {
        content_id: contentId,
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null,
        photos: photos.length > 0 ? photos : null,
        validated: false,
        reviewer_name: finalReviewerName
      };

      // Se l'utente è autenticato, aggiungi il suo ID
      if (user) {
        reviewData.user_id = user.id;
      }

      console.log("[ReviewForm] Submitting review:", reviewData);

      const { error } = await supabase
        .from("reviews")
        .insert(reviewData);

      if (error) {
        console.error("Error submitting review:", error);
        toast({
          title: "Errore",
          description: "Errore nell'invio della recensione: " + error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Successo",
          description: "Recensione inviata con successo! Sarà visibile dopo la validazione dell'amministratore."
        });
        setRating(0);
        setTitle("");
        setComment("");
        setReviewerName("");
        setPhotos([]);
        onReviewSubmitted?.();
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Errore",
        description: "Errore imprevisto nell'invio della recensione",
        variant: "destructive"
      });
    }

    setSubmitting(false);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Lascia una Recensione
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Valutazione *</Label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="p-1 rounded hover:bg-gray-100 transition-colors"
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i + 1)}
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      i < (hoverRating || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reviewerName" className="text-sm font-medium">Il tuo nome (opzionale)</Label>
            <Input
              id="reviewerName"
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              placeholder="Come ti chiami? (se non lo inserisci ne genereremo uno casuale)"
              maxLength={50}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Titolo (opzionale)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Riassumi la tua esperienza"
              maxLength={100}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-medium">Commento (opzionale)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descrivi la tua esperienza in dettaglio"
              rows={4}
              maxLength={500}
              className="w-full resize-none"
            />
          </div>

          {isNative && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Foto (opzionale)</Label>
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTakePhoto}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Camera className="h-4 w-4" />
                  Aggiungi Foto
                </Button>
                
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <Button
              type="submit"
              disabled={submitting || rating === 0}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Invio in corso...
                </div>
              ) : (
                "Invia Recensione"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
