
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

interface AddToCalendarButtonProps {
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  className?: string;
}

const AddToCalendarButton = ({ 
  title, 
  description, 
  startDate, 
  endDate, 
  location,
  className = "" 
}: AddToCalendarButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatDateForCalendar = (dateString?: string) => {
    if (!dateString) return new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    return new Date(dateString).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const handleGoogleCalendar = () => {
    const startDateTime = formatDateForCalendar(startDate);
    const endDateTime = formatDateForCalendar(endDate || startDate);
    
    const googleUrl = new URL('https://calendar.google.com/calendar/render');
    googleUrl.searchParams.set('action', 'TEMPLATE');
    googleUrl.searchParams.set('text', title);
    googleUrl.searchParams.set('dates', `${startDateTime}/${endDateTime}`);
    if (description) googleUrl.searchParams.set('details', description);
    if (location) googleUrl.searchParams.set('location', location);
    
    window.open(googleUrl.href, '_blank');
    setIsOpen(false);
  };

  const handleOutlookCalendar = () => {
    const startDateTime = formatDateForCalendar(startDate);
    const endDateTime = formatDateForCalendar(endDate || startDate);
    
    const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
    outlookUrl.searchParams.set('subject', title);
    outlookUrl.searchParams.set('startdt', startDateTime);
    outlookUrl.searchParams.set('enddt', endDateTime);
    if (description) outlookUrl.searchParams.set('body', description);
    if (location) outlookUrl.searchParams.set('location', location);
    
    window.open(outlookUrl.href, '_blank');
    setIsOpen(false);
  };

  const handleICalDownload = () => {
    const startDateTime = formatDateForCalendar(startDate);
    const endDateTime = formatDateForCalendar(endDate || startDate);
    
    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Your App//Event//EN',
      'BEGIN:VEVENT',
      `DTSTART:${startDateTime}`,
      `DTEND:${endDateTime}`,
      `SUMMARY:${title}`,
      description ? `DESCRIPTION:${description}` : '',
      location ? `LOCATION:${location}` : '',
      `UID:${Date.now()}@yourdomain.com`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].filter(Boolean).join('\r\n');

    const blob = new Blob([icalContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(url);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={className}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Aggiungi al calendario
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Aggiungi al calendario</h4>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoogleCalendar}
            className="w-full justify-start"
          >
            <Plus className="h-4 w-4 mr-2" />
            Google Calendar
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleOutlookCalendar}
            className="w-full justify-start"
          >
            <Plus className="h-4 w-4 mr-2" />
            Outlook Calendar
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleICalDownload}
            className="w-full justify-start"
          >
            <Plus className="h-4 w-4 mr-2" />
            Scarica .ics
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddToCalendarButton;
