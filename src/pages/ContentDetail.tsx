import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ContentHeader from "@/components/content/ContentHeader";
import ContentImageGallery from "@/components/content/ContentImageGallery";
import ContentContactInfo from "@/components/content/ContentContactInfo";
import ContentActionButtons from "@/components/content/ContentActionButtons";
import ContentBookingSidebar from "@/components/content/ContentBookingSidebar";
import ContentMapSection from "@/components/content/ContentMapSection";
import ReviewsList from "@/components/ReviewsList";
import ReviewForm from "@/components/ReviewForm";
import { useContentUrl } from "@/hooks/useContentUrl";
import { useErrorTracking } from "@/hooks/useErrorTracking";
import { useSEO } from "@/hooks/useSEO";
import { useEffect } from "react";
import SchemaContent from "@/components/seo/SchemaContent";
import SchemaOrganization from "@/components/seo/SchemaOrganization";
import SchemaBreadcrumbs from "@/components/seo/SchemaBreadcrumbs";
import SEOPerformanceOptimizer from "@/components/seo/SEOPerformanceOptimizer";
import { useMetaTags } from "@/hooks/useMetaTags";

const ContentDetail = () => {
  const { slugOrId, contentSlug } = useParams();
  const navigate = useNavigate();
  const { trackError } = useErrorTracking();
  const { generateUrl } = useContentUrl();
  
  // Determine which parameter to use based on the route
  // If we have contentSlug, it means we're using category/content pattern
  const searchParam = contentSlug || slugOrId;
  const categorySlug = contentSlug ? slugOrId : null;
  
  console.log("[ContentDetail] Route params:", { slugOrId, contentSlug, searchParam, categorySlug });
  console.log("[ContentDetail] Current location:", window.location.href);

  const { data: content, isLoading, error } = useQuery({
    queryKey: ["content", searchParam, categorySlug],
    queryFn: async () => {
      console.log("[ContentDetail] Fetching content for param:", searchParam);
      
      if (!searchParam) {
        console.error("[ContentDetail] No search parameter provided");
        throw new Error("No search parameter provided");
      }

      // First try to find by slug (with category validation if provided)
      let { data, error } = await supabase
        .from("contents")
        .select(`
          *,
          categories (
            id,
            name,
            slug,
            color
          ),
          providers (
            business_name,
            verified,
            phone,
            email,
            website
          ),
          content_tags (
            tags (
              id,
              name,
              slug
            )
          )
        `)
        .eq("slug", searchParam)
        .eq("published", true)
        .maybeSingle();

      console.log("[ContentDetail] Slug search result:", { data, error });

      // If we have a category slug, verify it matches
      if (data && categorySlug && data.categories?.slug !== categorySlug) {
        console.log("[ContentDetail] Category slug mismatch, content not found");
        data = null;
      }

      // If not found by slug, try by ID (if it looks like a UUID)
      if (!data && !error) {
        console.log("[ContentDetail] Not found by slug, trying by ID:", searchParam);
        
        const result = await supabase
          .from("contents")
          .select(`
            *,
            categories (
              id,
              name,
              slug,
              color
            ),
            providers (
              business_name,
              verified,
              phone,
              email,
              website
            ),
            content_tags (
              tags (
                id,
                name,
                slug
              )
            )
          `)
          .eq("id", searchParam)
          .eq("published", true)
          .maybeSingle();
          
        data = result.data;
        error = result.error;
        
        console.log("[ContentDetail] ID search result:", { data, error });

        // If found by ID, redirect to proper slug URL
        if (data && data.slug && data.categories?.slug) {
          const correctUrl = generateUrl(data.id, data.slug, data.categories.slug);
          console.log("[ContentDetail] Redirecting to correct URL:", correctUrl);
          navigate(correctUrl, { replace: true });
          return data; // Return data while redirecting
        }
      }

      if (error) {
        console.error("[ContentDetail] Database error:", error);
        trackError(error, { context: "content_fetch", searchParam });
        throw error;
      }

      if (!data) {
        console.error("[ContentDetail] Content not found for param:", searchParam);
        const notFoundError = new Error("Content not found");
        trackError(notFoundError, { context: "content_not_found", searchParam });
        throw notFoundError;
      }

      console.log("[ContentDetail] Content fetched successfully:", data);
      return data;
    },
    retry: 1,
    meta: {
      onError: (error: any) => {
        console.error("[ContentDetail] Query error:", error);
        trackError(error, { context: "query_error", searchParam });
      }
    }
  });

  // Set up SEO with enhanced meta tags and structured data
  useMetaTags({
    title: content?.meta_title || content?.title,
    description: content?.meta_description || content?.description,
    ogTitle: content?.meta_title || content?.title,
    ogDescription: content?.meta_description || content?.description,
    ogImage: content?.meta_image || content?.featured_image || 'https://glinda.it/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png',
    ogType: "article",
    twitterTitle: content?.meta_title || content?.title,
    twitterDescription: content?.meta_description || content?.description,
    twitterImage: content?.meta_image || content?.featured_image || 'https://glinda.it/lovable-uploads/df33b161-f952-484f-9188-9e42eb514df1.png',
    keywords: content?.content_tags?.map(ct => ct.tags?.name).join(', ') || undefined
  });

  useEffect(() => {
    if (content) {
      console.log("[ContentDetail] Content loaded:", {
        id: content.id,
        title: content.title,
        slug: content.slug
      });
    }
  }, [content]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento contenuto...</p>
          <p className="text-xs text-gray-400 mt-2">Ricerca per: {searchParam}</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    console.error("[ContentDetail] Rendering error state:", error);
    console.log("[ContentDetail] Available route params:", { slugOrId, contentSlug });
    return <Navigate to="/404" replace />;
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Safely access event fields with fallback
  const eventDate = (content as any).event_date || null;
  const eventTime = (content as any).event_time || null;
  const eventEndDate = (content as any).event_end_date || null;
  const eventEndTime = (content as any).event_end_time || null;

  // Create breadcrumbs for schema
  const breadcrumbs = [
    { name: 'Home', url: 'https://glinda.lovable.app/' },
    { name: 'Search', url: 'https://glinda.lovable.app/search' }
  ];

  if (content.categories) {
    breadcrumbs.push({
      name: content.categories.name,
      url: `https://glinda.lovable.app/search?category=${content.categories.slug}`
    });
  }

  breadcrumbs.push({
    name: content.title,
    url: currentUrl
  });

  return (
    <>
      <SEOPerformanceOptimizer />
      <SchemaOrganization />
      <SchemaContent 
        content={content}
        reviews={{ rating: 4.8, count: 50 }} // You can fetch actual reviews data here
      />
      <SchemaBreadcrumbs breadcrumbs={breadcrumbs} />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header */}
              <ContentHeader
                title={content.title}
                description={content.description}
                city={content.city}
                address={content.address}
                modality={content.modality}
                price_from={content.price_from}
                price_to={content.price_to}
                category={content.categories}
                tags={content.content_tags?.map(ct => ct.tags)}
                eventDate={eventDate}
                eventTime={eventTime}
                eventEndDate={eventEndDate}
                eventEndTime={eventEndTime}
              />

              {/* Image Gallery */}
              {content.featured_image && (
                <ContentImageGallery
                  featuredImage={content.featured_image}
                  images={content.images}
                  title={content.title}
                />
              )}

              {/* Contact Info */}
              <ContentContactInfo
                phone={content.phone}
                email={content.email}
                website={content.website}
                provider={content.providers}
              />

              {/* Action Buttons */}
              <ContentActionButtons
                id={content.id}
                title={content.title}
                currentUrl={currentUrl}
                eventDate={eventDate}
                eventTime={eventTime}
                eventEndDate={eventEndDate}
                eventEndTime={eventEndTime}
                address={content.address}
                city={content.city}
              />

              {/* Reviews Section */}
              <div className="space-y-6">
                <ReviewsList contentId={content.id} />
                <ReviewForm contentId={content.id} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <ContentBookingSidebar
                id={content.id}
                title={content.title}
                priceFrom={content.price_from}
                priceTo={content.price_to}
                purchasable={content.purchasable}
                bookingRequired={content.booking_required}
                stripePriceId={content.stripe_price_id}
                paymentType={content.payment_type}
                phone={content.phone}
                email={content.email}
                website={content.website}
              />

              {/* Map Section in sidebar */}
              {content.latitude && content.longitude && (
                <ContentMapSection
                  lat={content.latitude}
                  lng={content.longitude}
                  title={content.title}
                  address={content.address}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentDetail;
