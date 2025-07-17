
interface SchemaContentProps {
  content: {
    id: string;
    title: string;
    description?: string;
    featured_image?: string;
    meta_image?: string;
    city?: string;
    address?: string;
    price_from?: number;
    price_to?: number;
    event_date?: string;
    event_time?: string;
    event_end_date?: string;
    event_end_time?: string;
    modality?: string;
    categories?: {
      name: string;
      slug: string;
    };
    providers?: {
      business_name: string;
      verified: boolean;
    };
  };
  reviews?: {
    rating: number;
    count: number;
  };
}

const SchemaContent = ({ content, reviews }: SchemaContentProps) => {
  const baseUrl = 'https://glinda.lovable.app';
  const contentUrl = `${baseUrl}/content/${content.id}`;
  
  // Determine schema type based on content
  const getSchemaType = () => {
    if (content.event_date) {
      return "Event";
    }
    return "Course";
  };

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": getSchemaType(),
    "@id": contentUrl,
    "name": content.title,
    "description": content.description,
    "url": contentUrl,
    "image": content.meta_image || content.featured_image || "https://glinda.it/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png",
    "provider": {
      "@type": "Organization",
      "name": content.providers?.business_name || "Glinda",
      "url": baseUrl
    }
  };

  // Add event-specific properties
  if (content.event_date && getSchemaType() === "Event") {
    const eventStartDate = content.event_time 
      ? `${content.event_date}T${content.event_time}`
      : content.event_date;
    
    const eventEndDate = content.event_end_date && content.event_end_time
      ? `${content.event_end_date}T${content.event_end_time}`
      : content.event_end_date || eventStartDate;

    Object.assign(baseSchema, {
      "startDate": eventStartDate,
      "endDate": eventEndDate,
      "eventStatus": "https://schema.org/EventScheduled",
      "eventAttendanceMode": content.modality === 'online' 
        ? "https://schema.org/OnlineEventAttendanceMode"
        : content.modality === 'ibrido'
        ? "https://schema.org/MixedEventAttendanceMode" 
        : "https://schema.org/OfflineEventAttendanceMode"
    });

    if (content.address) {
      Object.assign(baseSchema, {
        "location": {
          "@type": "Place",
          "name": content.address,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": content.address,
            "addressLocality": content.city,
            "addressCountry": "IT"
          }
        }
      });
    }
  }

  // Add pricing information
  if (content.price_from !== undefined) {
    Object.assign(baseSchema, {
      "offers": {
        "@type": "Offer",
        "price": content.price_from,
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock",
        "validFrom": new Date().toISOString()
      }
    });
  }

  // Add review information
  if (reviews && reviews.count > 0) {
    Object.assign(baseSchema, {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": reviews.rating,
        "reviewCount": reviews.count,
        "bestRating": 5,
        "worstRating": 1
      }
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(baseSchema, null, 2)
      }}
    />
  );
};

export default SchemaContent;
