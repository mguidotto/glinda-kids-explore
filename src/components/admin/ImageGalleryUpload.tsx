
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image, Loader2 } from "lucide-react";

interface ImageGalleryUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const ImageGalleryUpload = ({ images, onImagesChange }: ImageGalleryUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('content-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadImage:', error);
      return null;
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setMessage('Tutti i file devono essere immagini');
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Ogni file deve essere più piccolo di 5MB');
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setMessage(null);

    try {
      const uploadPromises = validFiles.map(file => uploadImage(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      const successfulUploads = uploadedUrls.filter(url => url !== null) as string[];
      
      if (successfulUploads.length > 0) {
        const newImages = [...images, ...successfulUploads];
        onImagesChange(newImages);
        setMessage(`${successfulUploads.length} immagini caricate con successo`);
      } else {
        setMessage('Errore nel caricamento delle immagini');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setMessage('Errore nel caricamento delle immagini');
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const removeImage = async (indexToRemove: number) => {
    const imageUrl = images[indexToRemove];
    
    // Try to remove from storage
    try {
      const url = new URL(imageUrl);
      const filePath = url.pathname.split('/').slice(-2).join('/');
      
      await supabase.storage
        .from('content-images')
        .remove([filePath]);
    } catch (error) {
      console.error('Error removing image from storage:', error);
    }
    
    // Remove from array
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Galleria Immagini</Label>
        <p className="text-xs text-gray-500 mb-2">
          Carica fino a 10 immagini aggiuntive per la galleria
        </p>
        
        <div className="space-y-3">
          {/* Upload button */}
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="gallery-upload"
              disabled={uploading || images.length >= 10}
            />
            <Label htmlFor="gallery-upload">
              <Button
                type="button"
                variant="outline"
                disabled={uploading || images.length >= 10}
                className="cursor-pointer"
                asChild
              >
                <div className="flex items-center gap-2">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {uploading ? 'Caricamento...' : 'Carica Immagini'}
                </div>
              </Button>
            </Label>
          </div>

          {/* Image grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Galleria immagine ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Info text */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Image className="h-3 w-3" />
            <span>{images.length}/10 immagini caricate</span>
          </div>
        </div>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ImageGalleryUpload;
