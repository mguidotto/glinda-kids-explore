
import { useState } from "react";
import { Plus, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminContentActions = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    city: "",
    price_from: "",
    duration_minutes: "",
    max_participants: ""
  });

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "Errore",
        description: "Titolo e descrizione sono obbligatori",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('contents')
        .insert({
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id || null,
          city: formData.city || null,
          price_from: formData.price_from ? parseInt(formData.price_from) : null,
          duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : null,
          max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
          published: true
        });

      if (error) throw error;

      toast({
        title: "Successo",
        description: "Contenuto creato con successo"
      });

      setFormData({
        title: "",
        description: "",
        category_id: "",
        city: "",
        price_from: "",
        duration_minutes: "",
        max_participants: ""
      });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error creating content:', error);
      toast({
        title: "Errore",
        description: "Errore durante la creazione del contenuto",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: "",
      description: "",
      category_id: "",
      city: "",
      price_from: "",
      duration_minutes: "",
      max_participants: ""
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-1" />
            Crea Contenuto
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crea Nuovo Contenuto</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titolo *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Inserisci il titolo del contenuto"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrizione *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Inserisci la descrizione del contenuto"
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="city">Città</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Es. Milano"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Prezzo (€)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price_from}
                  onChange={(e) => setFormData({ ...formData, price_from: e.target.value })}
                  placeholder="Es. 25"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="duration">Durata (minuti)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration_minutes}
                  onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                  placeholder="Es. 60"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="participants">Max Partecipanti</Label>
                <Input
                  id="participants"
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({ ...formData, max_participants: e.target.value })}
                  placeholder="Es. 10"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
              <X className="h-4 w-4 mr-1" />
              Annulla
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-1" />
              {isLoading ? "Salvando..." : "Salva"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContentActions;
