
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
        alt={title}
        className="col-span-2 w-full h-64 object-cover rounded-lg"
      />
      <div className="space-y-2">
        {images && images[1] && (
          <img 
            src={images[1]} 
            alt={title}
            className="w-full h-31 object-cover rounded-lg"
          />
        )}
        {images && images[2] && (
          <img 
            src={images[2]} 
            alt={title}
            className="w-full h-31 object-cover rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default ContentImageGallery;
