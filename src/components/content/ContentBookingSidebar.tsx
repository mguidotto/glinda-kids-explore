
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
    console.log("Booking clicked for content:", id);
    // Add booking logic here
  };

  return (
    <div className="lg:col-span-1">
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

          {shouldShowBooking && (
            <>
              <Separator />
              <Button 
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
                disabled={!purchasable}
                onClick={handleBookingClick}
              >
                {purchasable ? 'Prenota Ora' : 'Contatta per Info'}
              </Button>
            </>
          )}

          <Button variant="outline" className="w-full">
            Contatta il Provider
          </Button>

          {shouldShowBooking && (
            <div className="text-xs text-gray-500 text-center">
              Cancellazione gratuita fino a 48h prima
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentBookingSidebar;
