
import { useBranding } from '@/hooks/useBranding';

interface SchemaOrganizationProps {
  contentData?: {
    name?: string;
    description?: string;
    image?: string;
    address?: string;
    city?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}

const SchemaOrganization = ({ contentData }: SchemaOrganizationProps) => {
  const { getSetting } = useBranding();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://glinda.lovable.app/#organization",
    "name": getSetting('site_title') || "Glinda",
    "alternateName": "Glinda",
    "description": getSetting('meta_description') || "Piattaforma di attività educative per bambini da 0 a 10 anni",
    "url": getSetting('canonical_url') || "https://glinda.lovable.app/",
    "logo": {
      "@type": "ImageObject",
      "url": getSetting('og_image') || "https://glinda.it/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png",
      "width": 1200,
      "height": 630
    },
    "image": getSetting('og_image') || "https://glinda.it/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png",
    "sameAs": [
      "https://www.facebook.com/glinda",
      "https://www.instagram.com/glinda",
      "https://twitter.com/glinda"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": contentData?.phone || "+39-000-000-0000",
      "contactType": "customer service",
      "areaServed": "IT",
      "availableLanguage": "Italian"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "IT",
      "addressLocality": contentData?.city || "Italia"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationSchema, null, 2)
      }}
    />
  );
};

export default SchemaOrganization;
