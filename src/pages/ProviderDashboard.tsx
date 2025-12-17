import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Eye, Info } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { useNavigate } from "react-router-dom";

type Provider = Database["public"]["Tables"]["providers"]["Row"];
type Content = Database["public"]["Tables"]["contents"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

const ProviderDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    fetchProvider();
    fetchCategories();
  }, [user, navigate]);

  useEffect(() => {
    if (provider) {
      fetchContents();
    }
  }, [provider]);

  const fetchProvider = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data } = await supabase
      .from("providers")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    setProvider(data);
    setLoading(false);
  };

  const fetchContents = async () => {
    if (!provider) return;
    
    const { data } = await supabase
      .from("contents")
      .select("*")
      .eq("provider_id", provider.id);
    
    setContents(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("active", true);
    
    setCategories(data || []);
  };

  const createProvider = async (formData: FormData) => {
    if (!user) return;

    const businessName = formData.get("businessName") as string;
    const description = formData.get("description") as string;
    const website = formData.get("website") as string;
    const address = formData.get("address") as string;
    const city = formData.get("city") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;

    const { error } = await supabase
      .from("providers")
      .insert({
        user_id: user.id,
        business_name: businessName,
        description,
        website,
        address,
        city,
        phone,
        email,
      });

    if (!error) {
      setMessage("Profilo gestore creato con successo! Ora puoi iniziare a pubblicare i tuoi contenuti.");
      fetchProvider();
      
      // Update user role to provider
      await supabase
        .from("profiles")
        .update({ role: "provider" })
        .eq("id", user.id);
    } else {
      setMessage("Errore durante la creazione del profilo: " + error.message);
    }
  };

  const createContent = async (formData: FormData) => {
    if (!provider) return;

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const contentType = formData.get("contentType") as string;
    const modality = formData.get("modality") as string;
    const priceFrom = parseFloat(formData.get("priceFrom") as string);
    const priceTo = parseFloat(formData.get("priceTo") as string);
    const city = formData.get("city") as string;
    const categoryId = formData.get("categoryId") as string;
    const address = formData.get("address") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const website = formData.get("website") as string;

    const { error } = await supabase
      .from("contents")
      .insert({
        provider_id: provider.id,
        category_id: categoryId,
        title,
        description,
        modality: modality as any,
        price_from: priceFrom ? priceFrom.toString() : null,
        city,
        address,
        phone,
        email,
        website,
        published: true,
      });

    if (!error) {
      setMessage("Contenuto creato con successo!");
      setIsEditing(false);
      fetchContents();
    } else {
      setMessage("Errore durante la creazione del contenuto: " + error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto pt-8 px-4 text-center">
          <p>Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto pt-8 px-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-6 w-6 text-blue-600" />
                Diventa un Provider - Registra la tua Attività
              </CardTitle>
              <p className="text-gray-600">
                Benvenuto! Per iniziare a pubblicare corsi, eventi e servizi per bambini e famiglie, 
                compila i dati della tua attività. Dopo la registrazione potrai gestire tutti i tuoi contenuti 
                e ricevere prenotazioni direttamente dalla piattaforma.
              </p>
            </CardHeader>
            <CardContent>
              {message && (
                <Alert className="mb-4">
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={(e) => {
                e.preventDefault();
                createProvider(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Nome dell'Attività *</Label>
                  <Input 
                    id="businessName" 
                    name="businessName" 
                    required 
                    placeholder="Es. Asilo Nido Arcobaleno, Centro Sportivo Kids, Studio Danza..." 
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrizione della tua attività *</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    required
                    placeholder="Descrivi cosa offri alle famiglie: tipologia di servizi, età dei bambini, metodologie utilizzate..." 
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Città *</Label>
                    <Input id="city" name="city" required placeholder="Milano" />
                  </div>
                  <div>
                    <Label htmlFor="address">Indirizzo</Label>
                    <Input id="address" name="address" placeholder="Via Roma 123" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefono *</Label>
                    <Input id="phone" name="phone" required placeholder="+39 02 1234567" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email di contatto *</Label>
                    <Input id="email" name="email" type="email" required placeholder="info@tuaattivita.it" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="website">Sito Web</Label>
                  <Input id="website" name="website" type="url" placeholder="https://tuosito.it" />
                </div>
                <Button type="submit" className="w-full">
                  Registra la mia Attività e Inizia
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto pt-8 px-4">
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Area Gestori</h1>
          <p className="text-gray-600">Benvenuto/a, {provider.business_name}</p>
          {!provider.verified && (
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ Il tuo profilo è in attesa di verifica. Una volta verificato, i tuoi contenuti saranno più visibili.
              </p>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Stats */}
          <div className="lg:col-span-3 grid md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{contents.length}</div>
                <p className="text-gray-600">Contenuti Pubblicati</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">0</div>
                <p className="text-gray-600">Prenotazioni Ricevute</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-gray-600">Valutazione Media</p>
              </CardContent>
            </Card>
          </div>

          {/* Content Management */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">I Tuoi Contenuti</h2>
              <Button onClick={() => setIsEditing(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi Contenuto
              </Button>
            </div>

            <div className="space-y-4">
              {contents.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-gray-500 mb-4">Non hai ancora pubblicato nessun contenuto.</p>
                    <Button onClick={() => setIsEditing(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Pubblica il tuo primo contenuto
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                contents.map((content) => (
                  <Card key={content.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{content.title}</h3>
                          <p className="text-gray-600 text-sm">{content.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>{content.city}</span>
                            {content.price_from && (
                              <span>{content.price_from}</span>
                            )}
                            <span className={`px-2 py-1 rounded text-xs ${
                              content.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {content.published ? 'Pubblicato' : 'Bozza'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Create/Edit Content Form */}
          {isEditing && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Aggiungi Nuovo Contenuto</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    createContent(new FormData(e.currentTarget));
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titolo *</Label>
                      <Input id="title" name="title" required placeholder="Es. Corso di Musica per Bambini" />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrizione *</Label>
                      <Textarea id="description" name="description" required placeholder="Descrivi la tua attività..." />
                    </div>
                    <div>
                      <Label htmlFor="categoryId">Categoria *</Label>
                      <Select name="categoryId" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="contentType">Tipo di Attività *</Label>
                      <Select name="contentType" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corso">Corso</SelectItem>
                          <SelectItem value="servizio">Servizio</SelectItem>
                          <SelectItem value="evento">Evento</SelectItem>
                          <SelectItem value="centro">Centro</SelectItem>
                          <SelectItem value="campo_estivo">Campo Estivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="modality">Modalità *</Label>
                      <Select name="modality" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona modalità" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="presenza">In Presenza</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="ibrido">Ibrido</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="priceFrom">Prezzo da (€)</Label>
                        <Input id="priceFrom" name="priceFrom" type="number" step="0.01" placeholder="10.00" />
                      </div>
                      <div>
                        <Label htmlFor="priceTo">Prezzo a (€)</Label>
                        <Input id="priceTo" name="priceTo" type="number" step="0.01" placeholder="25.00" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="city">Città *</Label>
                      <Input id="city" name="city" required placeholder="Milano" />
                    </div>
                    <div>
                      <Label htmlFor="address">Indirizzo</Label>
                      <Input id="address" name="address" placeholder="Via Roma 123" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefono</Label>
                      <Input id="phone" name="phone" placeholder="+39 02 1234567" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="info@tuaattivita.it" />
                    </div>
                    <div>
                      <Label htmlFor="website">Sito Web</Label>
                      <Input id="website" name="website" type="url" placeholder="https://tuosito.it" />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Pubblica Contenuto
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Annulla
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
