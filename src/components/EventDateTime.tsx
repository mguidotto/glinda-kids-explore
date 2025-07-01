
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCapacitor } from "@/hooks/useCapacitor";

interface EventDateTimeProps {
  eventDate?: string | null;
  eventTime?: string | null;
  eventEndDate?: string | null;
  eventEndTime?: string | null;
  title?: string;
  description?: string;
  location?: string;
  className?: string;
  showAddToCalendar?: boolean;
}

const EventDateTime = ({ 
  eventDate, 
  eventTime, 
  eventEndDate, 
  eventEndTime,
  title,
  description,
  location,
  className = "",
  showAddToCalendar = false
}: EventDateTimeProps) => {
  const { isNative } = useCapacitor();

  // Don't render if no event data
  if (!eventDate && !eventTime) {
    return null;
  }

  const formatEventDateTime = () => {
    let result = "";
    
    if (eventDate) {
      const date = new Date(eventDate);
      result += format(date, "EEEE d MMMM yyyy", { locale: it });
    }
    
    if (eventTime) {
      result += eventDate ? ` alle ${eventTime}` : `Ore ${eventTime}`;
    }
    
    // Add end date/time if different from start
    if (eventEndDate && eventEndDate !== eventDate) {
      const endDate = new Date(eventEndDate);
      result += ` - ${format(endDate, "EEEE d MMMM yyyy", { locale: it })}`;
      
      if (eventEndTime) {
        result += ` alle ${eventEndTime}`;
      }
    } else if (eventEndTime && eventEndTime !== eventTime) {
      result += ` - ${eventEndTime}`;
    }
    
    return result;
  };

  const handleAddToCalendar = () => {
    if (!eventDate || !title) return;

    const startDate = new Date(`${eventDate}${eventTime ? `T${eventTime}` : 'T09:00'}`);
    const endDate = eventEndDate && eventEndTime 
      ? new Date(`${eventEndDate}T${eventEndTime}`)
      : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

    if (isNative) {
      // Use native calendar integration
      const calendarUrl = `content://com.android.calendar/events`;
      const params = new URLSearchParams({
        title: title,
        dtstart: startDate.getTime().toString(),
        dtend: endDate.getTime().toString(),
        description: description || '',
        eventLocation: location || ''
      });
      
      window.open(`${calendarUrl}?${params}`, '_system');
    } else {
      // Fallback to Google Calendar
      const googleCalUrl = 'https://calendar.google.com/calendar/render';
      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: title,
        dates: `${startDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '')}/${endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/g, '')}`,
        details: description || '',
        location: location || ''
      });
      
      window.open(`${googleCalUrl}?${params}`, '_blank');
    }
  };

  return (
    <div className={`flex items-center gap-2 text-blue-600 ${className}`}>
      <CalendarIcon className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm font-medium flex-1">
        {formatEventDateTime()}
      </span>
      
      {showAddToCalendar && title && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddToCalendar}
          className="h-auto p-1 text-blue-600 hover:text-blue-800"
        >
          <Clock className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default EventDateTime;
