
interface ContentImageGalleryProps {
  featuredImage: string;
  images?: string[];
  title: string;
}

const ContentImageGallery = ({ featuredImage, images, title }: ContentImageGalleryProps) => {
  const hasImages = images && images.length > 0;
  
  if (featuredImage === "/placeholder.svg" && !hasImages) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      <img 
        src={featuredImage} 
        alt={`Immagine principale: ${title}`}
        className="col-span-2 w-full h-64 object-cover rounded-lg"
        width="400"
        height="256"
        loading="lazy"
      />
      <div className="space-y-2">
        {images && images[1] && (
          <img 
            src={images[1]} 
            alt={`Immagine aggiuntiva per ${title}`}
            className="w-full h-31 object-cover rounded-lg"
            width="200"
            height="124"
            loading="lazy"
          />
        )}
        {images && images[2] && (
          <img 
            src={images[2]} 
            alt={`Altra immagine per ${title}`}
            className="w-full h-31 object-cover rounded-lg"
            width="200"
            height="124"
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
};

export default ContentImageGallery;
