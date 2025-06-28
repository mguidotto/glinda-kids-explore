
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
  const { slug } = useParams();
  const { trackError } = useErrorTracking();
  
  console.log("[ContentDetail] Rendering with slug:", slug);

  const { data: content, isLoading, error } = useQuery({
    queryKey: ["content", slug],
    queryFn: async () => {
      console.log("[ContentDetail] Fetching content for slug:", slug);
      
      if (!slug) {
        console.error("[ContentDetail] No slug provided");
        throw new Error("No slug provided");
      }

      const { data, error } = await supabase
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
        .eq("slug", slug)
        .eq("published", true)
        .single();

      if (error) {
        console.error("[ContentDetail] Database error:", error);
        trackError(error, { context: "content_fetch", slug });
        throw error;
      }

      if (!data) {
        console.error("[ContentDetail] Content not found for slug:", slug);
        const notFoundError = new Error("Content not found");
        trackError(notFoundError, { context: "content_not_found", slug });
        throw notFoundError;
      }

      console.log("[ContentDetail] Content fetched successfully:", data);
      return data;
    },
    retry: 1,
    meta: {
      onError: (error: any) => {
        console.error("[ContentDetail] Query error:", error);
        trackError(error, { context: "query_error", slug });
      }
    }
  });

  const { getContentUrl } = useContentUrl();

  // Set up SEO
  useSEO({
    title: content?.meta_title || content?.title,
    description: content?.meta_description || content?.description,
    ogImage: content?.meta_image || content?.featured_image,
    type: "article"
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
              eventDate={content.event_date}
              eventTime={content.event_time}
              eventEndDate={content.event_end_date}
              eventEndTime={content.event_end_time}
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
              eventDate={content.event_date}
              eventTime={content.event_time}
              eventEndDate={content.event_end_date}
              eventEndTime={content.event_end_time}
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
