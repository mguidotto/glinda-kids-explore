
import AddToCalendarButton from "@/components/AddToCalendarButton";
import OpenInMapsButton from "@/components/OpenInMapsButton";

interface ContentActionButtonsProps {
  isEvent: boolean;
  hasValidAddress: boolean;
  title: string;
  description: string;
  address: string;
  city: string;
}

const ContentActionButtons = ({ 
  isEvent, 
  hasValidAddress, 
  title, 
  description, 
  address, 
  city 
}: ContentActionButtonsProps) => {
  if (!isEvent && !hasValidAddress) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-4">
      {isEvent && (
        <AddToCalendarButton
          title={title}
          description={description}
          location={hasValidAddress ? address : city}
        />
      )}
      {hasValidAddress && (
        <OpenInMapsButton address={address} />
      )}
    </div>
  );
};

export default ContentActionButtons;
