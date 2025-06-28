
import { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContentImageGalleryProps {
  featuredImage: string;
  images?: string[];
  title: string;
}

const ContentImageGallery = ({ featuredImage, images, title }: ContentImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const hasGalleryImages = images && images.length > 0;
  const allImages = [featuredImage, ...(images || [])].filter(img => img && img !== "/placeholder.svg");
  
  if (allImages.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setShowLightbox(true);
  };

  const closeLightbox = () => {
    setShowLightbox(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!showLightbox) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  // Add keyboard listener
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown);
  }

  if (allImages.length === 1) {
    // Single image layout
    return (
      <div className="mb-6">
        <img 
          src={allImages[0]} 
          alt={`Immagine: ${title}`}
          className="w-full h-64 md:h-80 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => openLightbox(0)}
          loading="lazy"
        />
        {showLightbox && (
          <ImageLightbox 
            images={allImages}
            currentIndex={currentImageIndex}
            onClose={closeLightbox}
            onNext={nextImage}
            onPrev={prevImage}
            title={title}
            setCurrentImageIndex={setCurrentImageIndex}
          />
        )}
      </div>
    );
  }

  // Gallery layout with featured image and thumbnails
  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {/* Main featured image */}
        <div className="md:col-span-2">
          <img 
            src={allImages[0]} 
            alt={`Immagine principale: ${title}`}
            className="w-full h-64 md:h-80 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openLightbox(0)}
            loading="lazy"
          />
        </div>
        
        {/* Thumbnail grid */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
          {allImages.slice(1, 5).map((image, index) => (
            <div key={index} className="relative">
              <img 
                src={image} 
                alt={`Immagine ${index + 2} per ${title}`}
                className="w-full h-31 md:h-[calc((20rem-0.5rem)/2)] object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openLightbox(index + 1)}
                loading="lazy"
              />
              {/* Show "+X more" overlay on last thumbnail if there are more images */}
              {index === 3 && allImages.length > 5 && (
                <div 
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg cursor-pointer hover:bg-opacity-60 transition-all"
                  onClick={() => openLightbox(4)}
                >
                  <span className="text-white font-semibold text-sm">
                    +{allImages.length - 5} altre
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <ImageLightbox 
          images={allImages}
          currentIndex={currentImageIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
          title={title}
          setCurrentImageIndex={setCurrentImageIndex}
        />
      )}
    </div>
  );
};

// Lightbox component
interface ImageLightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  title: string;
  setCurrentImageIndex: (index: number) => void;
}

const ImageLightbox = ({ images, currentIndex, onClose, onNext, onPrev, title, setCurrentImageIndex }: ImageLightboxProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      {/* Close button */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 z-10"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
      </Button>

      {/* Navigation buttons */}
      {images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 z-10"
            onClick={onPrev}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white hover:bg-opacity-20 z-10"
            onClick={onNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </>
      )}

      {/* Main image */}
      <div className="max-w-4xl max-h-[90vh] mx-4">
        <img
          src={images[currentIndex]}
          alt={`${title} - Immagine ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}

      {/* Thumbnail navigation */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-md overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden ${
                index === currentIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-80'
              }`}
              onClick={() => setCurrentImageIndex(index)}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentImageGallery;
