
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, CreditCard, Calendar, Euro } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Database } from "@/integrations/supabase/types";

type Content = Database["public"]["Tables"]["contents"]["Row"];

interface PurchaseButtonProps {
  content: Content & {
    providers?: { business_name: string; verified: boolean };
  };
}

const PurchaseButton = ({ content }: PurchaseButtonProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!content.purchasable || content.payment_type === 'free') {
    return null;
  }

  const handlePurchase = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = '/auth';
      return;
    }

    setLoading(true);
    
    try {
      if (content.booking_required) {
        // For booking-based content, redirect to booking flow
        window.location.href = `/content/${content.id}?action=book`;
      } else {
        // For direct purchase, create checkout session
        const { data, error } = await supabase.functions.invoke('create-checkout', {
          body: {
            contentId: content.id,
            priceId: content.stripe_price_id,
            returnUrl: window.location.origin + `/content/${content.id}?success=true`
          }
        });

        if (error) throw error;
        
        if (data?.url) {
          // Open Stripe checkout in new tab
          window.open(data.url, '_blank');
        }
      }
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPriceInfo = () => {
    if (content.price_from) {
      return (
        <div className="flex items-center gap-1">
          <Euro className="h-4 w-4 text-green-600" />
          <span className="font-bold text-green-600">{content.price_from}</span>
        </div>
      );
    }

    return null;
  };

  const getButtonText = () => {
    if (content.booking_required) {
      return "Prenota";
    }
    return "Acquista";
  };

  const getButtonIcon = () => {
    if (content.booking_required) {
      return <Calendar className="h-4 w-4 mr-2" />;
    }
    return <CreditCard className="h-4 w-4 mr-2" />;
  };

  return (
    <div className="space-y-2">
      {renderPriceInfo()}
      
      <div className="flex items-center gap-2">
        {content.payment_type === 'paid' && (
          <Badge variant="outline" className="text-green-600 border-green-600">
            <ShoppingCart className="h-3 w-3 mr-1" />
            Acquistabile
          </Badge>
        )}
        
        {content.booking_required && (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Calendar className="h-3 w-3 mr-1" />
            Prenotazione
          </Badge>
        )}
      </div>

      <Button 
        onClick={handlePurchase}
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
      >
        {getButtonIcon()}
        {loading ? "Caricamento..." : getButtonText()}
      </Button>
    </div>
  );
};

export default PurchaseButton;
