
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MapComponent from "@/components/MapComponent";

interface ContentMapSectionProps {
  hasValidAddress: boolean;
  address: string;
}

const ContentMapSection = ({ hasValidAddress, address }: ContentMapSectionProps) => {
  if (!hasValidAddress) {
    return null;
  }

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
