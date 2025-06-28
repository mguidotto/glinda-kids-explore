import { useParams, Navigate } from "react-router-dom";
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

const ContentDetail = () => {
  const { slugOrId, contentSlug } = useParams();
  const { trackError } = useErrorTracking();
  
  // Determine which parameter to use based on the route
  const searchParam = contentSlug || slugOrId;
  
  console.log("[ContentDetail] Rendering with params:", { slugOrId, contentSlug, searchParam });

  const { data: content, isLoading, error } = useQuery({
    queryKey: ["content", searchParam],
    queryFn: async () => {
      console.log("[ContentDetail] Fetching content for param:", searchParam);
      
      if (!searchParam) {
        console.error("[ContentDetail] No search parameter provided");
        throw new Error("No search parameter provided");
      }

      // First try to find by slug
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

      // If not found by slug and it looks like a UUID, try by ID
      if (!data && searchParam.length === 36 && searchParam.includes('-')) {
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

  // Set up SEO with proper Open Graph tags
  useSEO({
    title: content?.meta_title || content?.title,
    description: content?.meta_description || content?.description,
    ogTitle: content?.meta_title || content?.title,
    ogDescription: content?.meta_description || content?.description,
    ogImage: content?.meta_image || content?.featured_image || 'https://glinda.lovable.app/icon-512x512.png',
    ogType: "article",
    twitterTitle: content?.meta_title || content?.title,
    twitterDescription: content?.meta_description || content?.description,
    twitterImage: content?.meta_image || content?.featured_image || 'https://glinda.lovable.app/icon-512x512.png'
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento contenuto...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    console.error("[ContentDetail] Rendering error state:", error);
    return <Navigate to="/404" replace />;
  }

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  // Safely access event fields with fallback
  const eventDate = (content as any).event_date || null;
  const eventTime = (content as any).event_time || null;
  const eventEndDate = (content as any).event_end_date || null;
  const eventEndTime = (content as any).event_end_time || null;

  return (
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

            {/* Map Section */}
            {content.latitude && content.longitude && (
              <ContentMapSection
                lat={content.latitude}
                lng={content.longitude}
                title={content.title}
                address={content.address}
              />
            )}

            {/* Reviews Section */}
            <div className="space-y-6">
              <ReviewsList contentId={content.id} />
              <ReviewForm contentId={content.id} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
