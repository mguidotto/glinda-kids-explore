
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
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const { trackPageView, trackEvent } = useGoogleAnalytics();

  // SEO optimization for content detail page
  useSEO({
    title: content ? `${content.title} - Glinda | Attività per Bambini` : 'Caricamento...',
    description: content?.description || 'Scopri questa fantastica attività per bambini su Glinda',
    keywords: content ? `${content.title}, attività bambini, ${(content as any).categories?.name}, ${content.city}` : 'attività bambini',
    canonical: `https://glinda.lovable.app/content/${id}`,
    ogImage: content?.featured_image || 'https://glinda.lovable.app/icon-512x512.png'
  });

  useEffect(() => {
    const fetchContent = async () => {
      if (!id) return;
      
      const { data, error } = await supabase
        .from("contents")
        .select(`
          *,
          providers!inner(business_name, verified),
          categories!inner(name, slug)
        `)
        .eq("id", id)
        .eq("published", true)
        .single();

      if (!error && data) {
        setContent(data as Content);
        trackPageView(`/content/${id}`);
        trackEvent('view_content', {
          content_id: id,
          content_title: data.title,
          content_category: (data as any).categories?.name
        });
      }
      setLoading(false);
    };

    fetchContent();
  }, [id]);

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

            <ReviewsList contentId={id || ""} />
            <ReviewForm 
              contentId={id || ""} 
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
