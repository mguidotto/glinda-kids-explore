
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Mail, Phone, MapPin, Globe, Building } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Provider = Database["public"]["Tables"]["providers"]["Row"];

const ProvidersManagement = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [newProvider, setNewProvider] = useState({
    business_name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    verified: false
  });

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("providers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Errore nel caricamento dei provider: " + error.message);
    } else {
      setProviders(data || []);
    }
    setLoading(false);
  };

  const createProvider = async () => {
    if (!newProvider.business_name) {
      setError("Il nome dell'attività è obbligatorio");
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("providers")
      .insert({
        business_name: newProvider.business_name,
        description: newProvider.description || null,
        email: newProvider.email || null,
        phone: newProvider.phone || null,
        website: newProvider.website || null,
        address: newProvider.address || null,
        city: newProvider.city || null,
        verified: newProvider.verified
      });

    if (error) {
      setError("Errore nella creazione del provider: " + error.message);
    } else {
      setMessage("Provider creato con successo!");
      setIsCreateDialogOpen(false);
      setNewProvider({
        business_name: "",
        description: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        city: "",
        verified: false
      });
      fetchProviders();
    }
    setLoading(false);
  };

  const updateProvider = async () => {
    if (!selectedProvider) return;

    setLoading(true);
    const { error } = await supabase
      .from("providers")
      .update({
        business_name: selectedProvider.business_name,
        description: selectedProvider.description,
        email: selectedProvider.email,
        phone: selectedProvider.phone,
        website: selectedProvider.website,
        address: selectedProvider.address,
        city: selectedProvider.city,
        verified: selectedProvider.verified
      })
      .eq("id", selectedProvider.id);

    if (error) {
      setError("Errore nell'aggiornamento del provider: " + error.message);
    } else {
      setMessage("Provider aggiornato con successo!");
      setIsEditDialogOpen(false);
      setSelectedProvider(null);
      fetchProviders();
    }
    setLoading(false);
  };

  const deleteProvider = async (providerId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo provider? Questa azione non può essere annullata.")) {
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("providers")
      .delete()
      .eq("id", providerId);

    if (error) {
      setError("Errore nell'eliminazione del provider: " + error.message);
    } else {
      setMessage("Provider eliminato con successo!");
      fetchProviders();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestione Provider</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#8B4A6B] hover:bg-[#7A4060]">
              <Plus className="h-4 w-4 mr-2" />
              Crea Nuovo Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Crea Nuovo Provider</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="business_name">Nome Attività *</Label>
                <Input
                  id="business_name"
                  value={newProvider.business_name}
                  onChange={(e) => setNewProvider({...newProvider, business_name: e.target.value})}
                  placeholder="Nome dell'attività"
                />
              </div>
              <div>
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={newProvider.description}
                  onChange={(e) => setNewProvider({...newProvider, description: e.target.value})}
                  placeholder="Descrizione dell'attività"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newProvider.email}
                  onChange={(e) => setNewProvider({...newProvider, email: e.target.value})}
                  placeholder="email@esempio.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={newProvider.phone}
                  onChange={(e) => setNewProvider({...newProvider, phone: e.target.value})}
                  placeholder="+39 123 456 7890"
                />
              </div>
              <div>
                <Label htmlFor="website">Sito Web</Label>
                <Input
                  id="website"
                  value={newProvider.website}
                  onChange={(e) => setNewProvider({...newProvider, website: e.target.value})}
                  placeholder="https://esempio.com"
                />
              </div>
              <div>
                <Label htmlFor="address">Indirizzo</Label>
                <Input
                  id="address"
                  value={newProvider.address}
                  onChange={(e) => setNewProvider({...newProvider, address: e.target.value})}
                  placeholder="Via Esempio 123"
                />
              </div>
              <div>
                <Label htmlFor="city">Città</Label>
                <Input
                  id="city"
                  value={newProvider.city}
                  onChange={(e) => setNewProvider({...newProvider, city: e.target.value})}
                  placeholder="Milano"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="verified"
                  checked={newProvider.verified}
                  onCheckedChange={(checked) => setNewProvider({...newProvider, verified: checked})}
                />
                <Label htmlFor="verified">Provider Verificato</Label>
              </div>
              <Button 
                onClick={createProvider} 
                disabled={loading}
                className="w-full bg-[#8B4A6B] hover:bg-[#7A4060]"
              >
                {loading ? "Creazione..." : "Crea Provider"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista Provider ({providers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Caricamento...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Attività</TableHead>
                  <TableHead>Contatti</TableHead>
                  <TableHead>Ubicazione</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Creato</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providers.map((provider) => (
                  <TableRow key={provider.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {provider.business_name}
                        </div>
                        {provider.description && (
                          <div className="text-sm text-gray-600 mt-1">
                            {provider.description.slice(0, 50)}...
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {provider.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {provider.email}
                          </div>
                        )}
                        {provider.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {provider.phone}
                          </div>
                        )}
                        {provider.website && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <a href={provider.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              Sito Web
                            </a>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {provider.address && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {provider.address}
                          </div>
                        )}
                        {provider.city && (
                          <div className="text-gray-600">{provider.city}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={provider.verified ? "default" : "secondary"}>
                        {provider.verified ? "Verificato" : "Non Verificato"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(provider.created_at || '').toLocaleDateString('it-IT')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedProvider(provider);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProvider(provider.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Provider Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifica Provider</DialogTitle>
          </DialogHeader>
          {selectedProvider && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit_business_name">Nome Attività *</Label>
                <Input
                  id="edit_business_name"
                  value={selectedProvider.business_name}
                  onChange={(e) => setSelectedProvider({...selectedProvider, business_name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_description">Descrizione</Label>
                <Textarea
                  id="edit_description"
                  value={selectedProvider.description || ""}
                  onChange={(e) => setSelectedProvider({...selectedProvider, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit_email">Email</Label>
                <Input
                  id="edit_email"
                  type="email"
                  value={selectedProvider.email || ""}
                  onChange={(e) => setSelectedProvider({...selectedProvider, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_phone">Telefono</Label>
                <Input
                  id="edit_phone"
                  value={selectedProvider.phone || ""}
                  onChange={(e) => setSelectedProvider({...selectedProvider, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_website">Sito Web</Label>
                <Input
                  id="edit_website"
                  value={selectedProvider.website || ""}
                  onChange={(e) => setSelectedProvider({...selectedProvider, website: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_address">Indirizzo</Label>
                <Input
                  id="edit_address"
                  value={selectedProvider.address || ""}
                  onChange={(e) => setSelectedProvider({...selectedProvider, address: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="edit_city">Città</Label>
                <Input
                  id="edit_city"
                  value={selectedProvider.city || ""}
                  onChange={(e) => setSelectedProvider({...selectedProvider, city: e.target.value})}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit_verified"
                  checked={selectedProvider.verified || false}
                  onCheckedChange={(checked) => setSelectedProvider({...selectedProvider, verified: checked})}
                />
                <Label htmlFor="edit_verified">Provider Verificato</Label>
              </div>
              <Button 
                onClick={updateProvider} 
                disabled={loading}
                className="w-full bg-[#8B4A6B] hover:bg-[#7A4060]"
              >
                {loading ? "Aggiornamento..." : "Aggiorna Provider"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProvidersManagement;
