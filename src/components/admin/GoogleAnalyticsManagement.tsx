
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Save, BarChart3 } from "lucide-react";

const GoogleAnalyticsManagement = () => {
  const [analyticsId, setAnalyticsId] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAnalyticsId = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('value')
          .eq('key', 'google_analytics_id')
          .maybeSingle();

        if (!error && data) {
          setAnalyticsId(data.value || '');
        }
      } catch (error) {
        console.error('Error fetching Google Analytics ID:', error);
        toast.error('Errore nel caricamento dell\'ID di Google Analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsId();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({
          key: 'google_analytics_id',
          value: analyticsId.trim()
        }, {
          onConflict: 'key'
        });

      if (error) throw error;

      toast.success('Google Analytics ID salvato con successo');
      
      // Reload the page to apply the new Analytics ID
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Error saving Google Analytics ID:', error);
      toast.error('Errore nel salvataggio dell\'ID di Google Analytics');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Google Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>Caricamento...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Google Analytics
        </CardTitle>
        <CardDescription>
          Configura Google Analytics per tracciare le visite e l'engagement del sito.
          Inserisci l'ID di misurazione di Google Analytics (es. G-XXXXXXXXXX).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="analytics-id">ID di Google Analytics</Label>
          <Input
            id="analytics-id"
            placeholder="G-XXXXXXXXXX"
            value={analyticsId}
            onChange={(e) => setAnalyticsId(e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Trova il tuo ID di misurazione in Google Analytics → Admin → Flussi di dati → Il tuo sito web
          </p>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvataggio...' : 'Salva Configurazione'}
        </Button>

        {analyticsId && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              ✅ Google Analytics è configurato e attivo su tutte le pagine.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAnalyticsManagement;
