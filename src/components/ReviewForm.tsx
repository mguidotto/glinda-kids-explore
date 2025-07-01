
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
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  const handleTakePhoto = async () => {
    if (!isNative) return;
    
    const result = await takePicture();
    if (result.dataUrl && !result.error) {
      setPhotos(prev => [...prev, result.dataUrl!]);
    } else if (result.error) {
      setMessage(`Errore nella foto: ${result.error}`);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage("Devi essere autenticato per lasciare una recensione");
      return;
    }

    if (rating === 0) {
      setMessage("Seleziona una valutazione");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("reviews")
      .insert({
        content_id: contentId,
        user_id: user.id,
        rating,
        title: title.trim() || null,
        comment: comment.trim() || null,
        photos: photos.length > 0 ? photos : null,
        validated: false
      });

    if (error) {
      console.error("Error submitting review:", error);
      setMessage("Errore nell'invio della recensione");
    } else {
      setMessage("Recensione inviata con successo! Sarà visibile dopo la validazione dell'amministratore.");
      setRating(0);
      setTitle("");
      setComment("");
      setPhotos([]);
      onReviewSubmitted?.();
    }

    setSubmitting(false);
    setTimeout(() => setMessage(null), 5000);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">
            <a href="/auth" className="text-orange-600 hover:underline">
              Accedi
            </a>
            {" "}per lasciare una recensione
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Lascia una Recensione
        </CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Valutazione *</Label>
            <div className="flex gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className="p-1"
                  onMouseEnter={() => setHoverRating(i + 1)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i + 1)}
                >
                  <Star
                    className={`h-6 w-6 ${
                      i < (hoverRating || rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="title">Titolo (opzionale)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Riassumi la tua esperienza"
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="comment">Commento (opzionale)</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Descrivi la tua esperienza in dettaglio"
              rows={4}
              maxLength={500}
            />
          </div>

          {isNative && (
            <div>
              <Label>Foto (opzionale)</Label>
              <div className="mt-2 space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleTakePhoto}
                  className="flex items-center gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Aggiungi Foto
                </Button>
                
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting || rating === 0}
            className="w-full"
          >
            {submitting ? "Invio in corso..." : "Invia Recensione"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
