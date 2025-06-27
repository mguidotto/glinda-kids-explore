
import { useState } from "react";
import { Share2, Copy, Facebook, Twitter, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

const ShareButton = ({ url, title, description, className = "" }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copiato negli appunti!");
      setIsOpen(false);
    } catch (error) {
      toast.error("Errore nel copiare il link");
      console.error('Error copying to clipboard:', error);
    }
  };

  const handleShareFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleShareTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  const handleShareWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title} - ${url}`)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url
        });
        setIsOpen(false);
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`hover:bg-white/90 p-2 ${className}`}
        >
          <Share2 className="h-4 w-4 text-gray-600" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Condividi</h4>
          
          {navigator.share && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNativeShare}
              className="w-full justify-start"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Condividi
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="w-full justify-start"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copia link
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShareFacebook}
            className="w-full justify-start"
          >
            <Facebook className="h-4 w-4 mr-2" />
            Facebook
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShareTwitter}
            className="w-full justify-start"
          >
            <Twitter className="h-4 w-4 mr-2" />
            Twitter
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShareWhatsApp}
            className="w-full justify-start"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareButton;
