
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { CalendarIcon, Clock } from "lucide-react";

interface EventDateTimeProps {
  eventDate?: string | null;
  eventTime?: string | null;
  eventEndDate?: string | null;
  eventEndTime?: string | null;
  className?: string;
}

const EventDateTime = ({ 
  eventDate, 
  eventTime, 
  eventEndDate, 
  eventEndTime,
  className = ""
}: EventDateTimeProps) => {
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

  return (
    <div className={`flex items-center gap-2 text-blue-600 ${className}`}>
      <CalendarIcon className="h-4 w-4 flex-shrink-0" />
      <span className="text-sm font-medium">
        {formatEventDateTime()}
      </span>
    </div>
  );
};

export default EventDateTime;
