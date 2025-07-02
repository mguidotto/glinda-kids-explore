
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, X } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

const InstallPrompt = () => {
  const { canInstall, installApp } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show prompt after user has been on the site for a while
    const timer = setTimeout(() => {
      if (canInstall && !dismissed) {
        setShowPrompt(true);
      }
    }, 10000); // Show after 10 seconds

    return () => clearTimeout(timer);
  }, [canInstall, dismissed]);

  useEffect(() => {
    // Check if user has previously dismissed the prompt
    const wasDismissed = localStorage.getItem('install-prompt-dismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleInstall = async () => {
    await installApp();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('install-prompt-dismissed', 'true');
  };

  if (!showPrompt || !canInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50">
      <Card className="border-2 border-[#8B4A6B] shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-sm mb-1">
                Installa Glinda
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Aggiungi Glinda alla schermata home per un accesso rapido e un'esperienza migliore!
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="bg-[#8B4A6B] hover:bg-[#7A4160] text-white"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Installa
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDismiss}
                >
                  Non ora
                </Button>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 flex-shrink-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallPrompt;
