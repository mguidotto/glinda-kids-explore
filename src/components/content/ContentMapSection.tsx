
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MapComponent from "@/components/MapComponent";

interface ContentMapSectionProps {
  lat: number;
  lng: number;
  title: string;
  address: string;
}

const ContentMapSection = ({ lat, lng, title, address }: ContentMapSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Posizione</CardTitle>
      </CardHeader>
      <CardContent>
        <MapComponent address={address} />
      </CardContent>
    </Card>
  );
};

export default ContentMapSection;
