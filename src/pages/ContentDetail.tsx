
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import ReviewsList from "@/components/ReviewsList";
import ReviewForm from "@/components/ReviewForm";
import ContentImageGallery from "@/components/content/ContentImageGallery";
import ContentHeader from "@/components/content/ContentHeader";
import ContentActionButtons from "@/components/content/ContentActionButtons";
import ContentContactInfo from "@/components/content/ContentContactInfo";
import ContentBookingSidebar from "@/components/content/ContentBookingSidebar";
import ContentMapSection from "@/components/content/ContentMapSection";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useGoogleAnalytics } from "@/hooks/useGoogleAnalytics";
import { useSEO } from "@/hooks/useSEO";

type Content = Database["public"]["Tables"]["contents"]["Row"] & {
  providers: { business_name: string; verified: boolean };
  categories: { name: string; slug: string };
};

const ContentDetail = () => {
  const { slugOrId, categorySlug, contentSlug } = useParams<{ 
    slugOrId?: string; 
    categorySlug?: string; 
    contentSlug?: string; 
  }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const { trackPageView, trackEvent } = useGoogleAnalytics();

  // Determine the identifier to use
  const identifier = contentSlug || slugOrId;

  // SEO optimization for content detail page
  useSEO({
    title: content ? `${content.title} - Glinda | Attività per Bambini` : 'Caricamento...',
    description: content?.description || 'Scopri questa fantastica attività per bambini su Glinda',
    keywords: content ? `${content.title}, attività bambini, ${(content as any).categories?.name}, ${content.city}` : 'attività bambini',
    canonical: content?.slug 
      ? `https://glinda.lovable.app/${(content as any).categories?.slug}/${content.slug}`
      : `https://glinda.lovable.app/content/${content?.id}`,
    ogImage: content?.featured_image || 'https://glinda.lovable.app/icon-512x512.png'
  });

  useEffect(() => {
    const fetchContent = async () => {
      if (!identifier) return;
      
      console.log('Fetching content with identifier:', identifier);
      console.log('Category slug:', categorySlug);
      
      // First try to find by slug
      let { data, error } = await supabase
        .from("contents")
        .select(`
          *,
          providers!inner(business_name, verified),
          categories!inner(name, slug)
        `)
        .eq("slug", identifier)
        .eq("published", true)
        .maybeSingle();

      // If not found by slug, try by ID
      if (!data && !error) {
        console.log('Content not found by slug, trying by ID');
        const result = await supabase
          .from("contents")
          .select(`
            *,
            providers!inner(business_name, verified),
            categories!inner(name, slug)
          `)
          .eq("id", identifier)
          .eq("published", true)
          .maybeSingle();
        
        data = result.data;
        error = result.error;
      }

      if (!error && data) {
        // If we have a category slug in the URL, verify it matches
        if (categorySlug && (data as any).categories?.slug !== categorySlug) {
          console.log('Category slug mismatch, redirecting to correct URL');
          if (data.slug) {
            navigate(`/${(data as any).categories.slug}/${data.slug}`, { replace: true });
          } else {
            navigate(`/content/${data.id}`, { replace: true });
          }
          return;
        }

        // If we accessed by ID but content has a slug, redirect to pretty URL
        if (slugOrId === data.id && data.slug && (data as any).categories?.slug) {
          console.log('Redirecting to pretty URL');
          navigate(`/${(data as any).categories.slug}/${data.slug}`, { replace: true });
          return;
        }

        setContent(data as Content);
        trackPageView(window.location.pathname);
        trackEvent('view_content', {
          content_id: data.id,
          content_title: data.title,
          content_category: (data as any).categories?.name
        });
      }
      setLoading(false);
    };

    fetchContent();
  }, [identifier, categorySlug, navigate, trackPageView, trackEvent, slugOrId]);

  const handleReviewSubmitted = () => {
    window.location.reload();
  };

  const handleBackClick = () => {
    navigate("/");
  };

  const handleBookingClick = () => {
    if (content) {
      trackEvent('booking_click', { content_id: content.id });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>Caricamento...</div>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>Contenuto non trovato</div>
        </div>
      </div>
    );
  }

  const shouldShowBooking = content.booking_required;
  const shouldShowPrice = content.price_from && content.payment_type !== 'free';
  const isBookableService = content.booking_required;
  const hasImages = content.images && content.images.length > 0;
  const featuredImage = content.featured_image || (content.images && content.images[0]) || "/placeholder.svg";
  const hasValidAddress = content.address && content.address.trim().length > 0;
  const isEvent = (content as any).categories?.slug === 'eventi';
  const currentUrl = window.location.href;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="ghost" className="mb-6" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Torna alla homepage
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image gallery */}
            <ContentImageGallery
              featuredImage={featuredImage}
              images={content.images}
              title={content.title}
            />

            {/* Content info */}
            <Card>
              <CardHeader>
                <ContentHeader
                  title={content.title}
                  city={content.city}
                  categoryName={(content as any).categories?.name}
                  contentId={content.id}
                  currentUrl={currentUrl}
                  description={content.description || ''}
                />
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">{content.description}</p>
                
                {/* Action buttons for events and locations */}
                <ContentActionButtons
                  isEvent={isEvent}
                  hasValidAddress={hasValidAddress}
                  title={content.title}
                  description={content.description || ''}
                  address={content.address || ''}
                  city={content.city}
                />
                
                {/* Contact info */}
                <ContentContactInfo
                  address={content.address}
                  phone={content.phone}
                  email={content.email}
                  website={content.website}
                  hasValidAddress={hasValidAddress}
                />
              </CardContent>
            </Card>

            {/* Map */}
            <ContentMapSection
              hasValidAddress={hasValidAddress}
              address={content.address || ''}
            />

            <ReviewsList contentId={content.id} />
            <ReviewForm 
              contentId={content.id} 
              onReviewSubmitted={handleReviewSubmitted}
            />
          </div>

          {/* Booking sidebar */}
          <ContentBookingSidebar
            shouldShowBooking={shouldShowBooking}
            shouldShowPrice={shouldShowPrice}
            priceFrom={content.price_from}
            priceTo={content.price_to}
            durationMinutes={content.duration_minutes}
            maxParticipants={content.max_participants}
            modality={content.modality}
            isBookableService={isBookableService}
            contentId={content.id}
            onBookingClick={handleBookingClick}
          />
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
