
interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SchemaBreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

const SchemaBreadcrumbs = ({ breadcrumbs }: SchemaBreadcrumbsProps) => {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": breadcrumb.name,
      "item": breadcrumb.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(breadcrumbSchema, null, 2)
      }}
    />
  );
};

export default SchemaBreadcrumbs;
