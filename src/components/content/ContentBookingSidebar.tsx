
import { Euro, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ContentBookingSidebarProps {
  id: string;
  title: string;
  priceFrom?: number | null;
  priceTo?: number | null;
  purchasable?: boolean;
  bookingRequired?: boolean;
  stripePriceId?: string | null;
  paymentType?: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
}

const ContentBookingSidebar = ({
  id,
  title,
  priceFrom,
  priceTo,
  purchasable = false,
  bookingRequired = false,
  stripePriceId,
  paymentType,
  phone,
  email,
  website
}: ContentBookingSidebarProps) => {
  const shouldShowPrice = priceFrom || priceTo;
  const shouldShowBooking = bookingRequired || purchasable;
  
  if (!shouldShowBooking && !shouldShowPrice) {
    return null;
  }

  const handleBookingClick = () => {
    if (website) {
      window.open(website, '_blank');
    }
  };

  const handleContactClick = () => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{shouldShowBooking ? 'Prenota' : 'Info'}</span>
          {shouldShowPrice && (
            <div className="flex items-center gap-1">
              <Euro className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">
                {priceFrom}€
                {priceTo && priceTo !== priceFrom && (
                  <span className="text-sm"> - {priceTo}€</span>
                )}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Badge className="bg-green-100 text-green-800">
            In Presenza
          </Badge>
        </div>

        {shouldShowBooking && website && (
          <>
            <Separator />
            <Button 
              className="w-full bg-gradient-to-r from-[#8B4A6B] to-[#7BB3BD] hover:from-[#7A4060] hover:to-[#6BA3AD] text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={handleBookingClick}
            >
              Prenota Ora
            </Button>
          </>
        )}

        {email && (
          <Button 
            variant="outline" 
            className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
            onClick={handleContactClick}
          >
            Chiedi informazioni
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ContentBookingSidebar;
