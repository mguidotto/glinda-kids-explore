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
import { Trash2, Edit, Plus, Mail, Phone, MapPin, Globe, Building, Upload, X } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [newProvider, setNewProvider] = useState({
    business_name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    verified: false,
    avatar_url: ""
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

  const uploadAvatar = async (file: File, isEdit = false) => {
    try {
      setAvatarUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('content-images')
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      if (isEdit && selectedProvider) {
        setSelectedProvider({ ...selectedProvider, avatar_url: avatarUrl });
      } else {
        setNewProvider({ ...newProvider, avatar_url: avatarUrl });
      }

      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      setError('Errore nel caricamento dell\'avatar');
      throw error;
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Il file deve essere inferiore a 2MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Il file deve essere un\'immagine');
      return;
    }

    await uploadAvatar(file, isEdit);
  };

  const removeAvatar = (isEdit = false) => {
    if (isEdit && selectedProvider) {
      setSelectedProvider({ ...selectedProvider, avatar_url: "" });
    } else {
      setNewProvider({ ...newProvider, avatar_url: "" });
    }
  };

  const createProvider = async () => {
    if (!newProvider.business_name) {
      setError("Il nome dell'attività è obbligatorio");
      return;
    }

    setLoading(true);
    // Non impostiamo user_id per i provider creati dagli admin
    // Gli admin possono creare provider indipendenti
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
        verified: newProvider.verified,
        avatar_url: newProvider.avatar_url || null,
        user_id: null // Gli admin creano provider senza associarli a un utente specifico
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
        verified: false,
        avatar_url: ""
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
        verified: selectedProvider.verified,
        avatar_url: selectedProvider.avatar_url
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
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={newProvider.avatar_url} alt="Avatar" />
                    <AvatarFallback className="bg-gray-200">
                      <Building className="h-8 w-8 text-gray-500" />
                    </AvatarFallback>
                  </Avatar>
                  {newProvider.avatar_url && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeAvatar(false)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">
                        {avatarUploading ? "Caricamento..." : "Carica Avatar"}
                      </span>
                    </div>
                  </Label>
                  <Input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAvatarUpload(e, false)}
                    disabled={avatarUploading}
                  />
                  <p className="text-xs text-gray-500">Max 2MB, formati supportati: JPG, PNG</p>
                </div>
              </div>

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
                disabled={loading || avatarUploading}
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
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={provider.avatar_url || ''} alt={provider.business_name} />
                          <AvatarFallback className="bg-gray-200">
                            <Building className="h-5 w-5 text-gray-500" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{provider.business_name}</div>
                          {provider.description && (
                            <div className="text-sm text-gray-600 mt-1">
                              {provider.description.slice(0, 50)}...
                            </div>
                          )}
                        </div>
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
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedProvider.avatar_url || ''} alt="Avatar" />
                    <AvatarFallback className="bg-gray-200">
                      <Building className="h-8 w-8 text-gray-500" />
                    </AvatarFallback>
                  </Avatar>
                  {selectedProvider.avatar_url && (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => removeAvatar(true)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <Label htmlFor="edit-avatar-upload" className="cursor-pointer">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">
                        {avatarUploading ? "Caricamento..." : "Carica Avatar"}
                      </span>
                    </div>
                  </Label>
                  <Input
                    id="edit-avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAvatarUpload(e, true)}
                    disabled={avatarUploading}
                  />
                  <p className="text-xs text-gray-500">Max 2MB, formati supportati: JPG, PNG</p>
                </div>
              </div>

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
                disabled={loading || avatarUploading}
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
