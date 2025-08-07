
import { Euro, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface ContentBookingSidebarProps {
  id: string;
  title: string;
  priceFrom?: number | string | null;
  priceTo?: number | string | null;
  purchasable?: boolean;
  bookingRequired?: boolean;
  stripePriceId?: string | null;
  paymentType?: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  modality?: string | null;
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
  website,
  modality
}: ContentBookingSidebarProps) => {
  const shouldShowPrice = priceFrom || priceTo;
  const shouldShowBooking = bookingRequired || purchasable;
  
  if (!shouldShowBooking && !shouldShowPrice && !website) {
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
              <span className="text-2xl font-bold text-green-600">
                {typeof priceFrom === 'string' ? priceFrom.replace('€', '') : priceFrom}
                {priceTo && priceTo !== priceFrom && (
                  <span className="text-sm"> - {typeof priceTo === 'string' ? priceTo.replace('€', '') : priceTo}</span>
                )}
              </span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Badge className="bg-green-100 text-green-800">
            {modality === 'online' ? 'Online' : 'In Presenza'}
          </Badge>
        </div>

        {website && (
          <>
            <Separator />
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              onClick={handleBookingClick}
            >
              {shouldShowBooking ? 'Prenota Ora' : 'Vai al Sito'}
            </Button>
          </>
        )}

        {email && (
          <Button 
            variant="outline" 
            className="w-full"
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
