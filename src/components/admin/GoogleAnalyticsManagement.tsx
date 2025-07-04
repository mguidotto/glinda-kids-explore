
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
        console.log('Fetching Google Analytics ID from database...');
        const { data, error } = await supabase
          .from('app_texts')
          .select('value')
          .eq('key', 'google_analytics_id')
          .maybeSingle();

        console.log('Database query result:', { data, error });

        if (error) {
          console.error('Error fetching Google Analytics ID:', error);
          toast.error('Errore nel caricamento dell\'ID di Google Analytics');
        } else {
          const idValue = data?.value || '';
          setAnalyticsId(idValue);
          console.log('Loaded Google Analytics ID:', idValue || 'none');
        }
      } catch (error) {
        console.error('Unexpected error fetching Google Analytics ID:', error);
        toast.error('Errore nel caricamento dell\'ID di Google Analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsId();
  }, []);

  const handleSave = async () => {
    console.log('Starting save process for Google Analytics ID:', analyticsId.trim());
    
    if (!analyticsId.trim()) {
      toast.error('Inserisci un ID di Google Analytics valido');
      return;
    }

    setSaving(true);
    try {
      // First, try to check current user and permissions
      const { data: userData, error: userError } = await supabase.auth.getUser();
      console.log('Current user:', userData?.user?.email, 'Error:', userError);

      // Check if user has admin role
      if (userData?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userData.user.id)
          .single();
        
        console.log('User profile role:', profileData?.role, 'Error:', profileError);
      }

      console.log('Attempting to upsert Google Analytics ID...');
      
      // Try the upsert operation
      const { data: upsertData, error: upsertError } = await supabase
        .from('app_texts')
        .upsert(
          {
            key: 'google_analytics_id',
            value: analyticsId.trim(),
            category: 'settings',
            description: 'Google Analytics Measurement ID'
          },
          {
            onConflict: 'key'
          }
        )
        .select();

      console.log('Upsert result:', { data: upsertData, error: upsertError });

      if (upsertError) {
        console.error('Upsert error details:', upsertError);
        toast.error(`Errore nel salvataggio: ${upsertError.message}`);
        return;
      }

      // Verify the record was actually saved
      console.log('Verifying save by fetching the record...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('app_texts')
        .select('*')
        .eq('key', 'google_analytics_id')
        .maybeSingle();

      console.log('Verification result:', { data: verifyData, error: verifyError });

      if (verifyError) {
        console.error('Verification error:', verifyError);
        toast.error('Errore nella verifica del salvataggio');
        return;
      }

      if (!verifyData) {
        console.error('Record not found after save attempt');
        toast.error('Il record non è stato salvato correttamente');
        return;
      }

      console.log('Google Analytics ID saved and verified successfully:', analyticsId.trim());
      toast.success('Google Analytics ID salvato con successo');
      
      // Reload the page to apply the new Analytics ID
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error('Unexpected error during save:', error);
      toast.error('Errore imprevisto nel salvataggio');
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
          disabled={saving || !analyticsId.trim()}
          className="w-full"
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Salvataggio...' : 'Salva Configurazione'}
        </Button>

        {analyticsId && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              ✅ Google Analytics è configurato con ID: <strong>{analyticsId}</strong>
            </p>
            <p className="text-sm text-green-600 mt-1">
              L'Analytics è attivo su tutte le pagine del sito.
            </p>
          </div>
        )}

        {!analyticsId && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-800">
              ⚠️ Google Analytics non è ancora configurato.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleAnalyticsManagement;
