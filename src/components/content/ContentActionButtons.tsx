
import AddToCalendarButton from "@/components/AddToCalendarButton";
import OpenInMapsButton from "@/components/OpenInMapsButton";

interface ContentActionButtonsProps {
  id: string;
  title: string;
  currentUrl: string;
  eventDate?: string | null;
  eventTime?: string | null;
  eventEndDate?: string | null;
  eventEndTime?: string | null;
  address?: string;
  city?: string;
}

const ContentActionButtons = ({ 
  id,
  title,
  currentUrl,
  eventDate,
  eventTime,
  eventEndDate,
  eventEndTime,
  address,
  city
}: ContentActionButtonsProps) => {
  const isEvent = eventDate || eventTime;
  const hasValidAddress = address && address.trim() !== '';
  const description = `Dettagli disponibili su: ${currentUrl}`;

  if (!isEvent && !hasValidAddress) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-4">
      {isEvent && (
        <AddToCalendarButton
          title={title}
          description={description}
          location={hasValidAddress ? address! : city || ''}
        />
      )}
      {hasValidAddress && (
        <OpenInMapsButton address={address!} />
      )}
    </div>
  );
};

export default ContentActionButtons;
