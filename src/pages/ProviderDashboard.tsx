
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import Navigation from "@/components/Navigation";

type Provider = Database["public"]["Tables"]["providers"]["Row"];
type Content = Database["public"]["Tables"]["contents"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

const ProviderDashboard = () => {
  const { user, profile } = useAuth();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProvider();
      fetchContents();
      fetchCategories();
    }
  }, [user]);

  const fetchProvider = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("providers")
      .select("*")
      .eq("user_id", user.id)
      .single();
    
    setProvider(data);
  };

  const fetchContents = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from("contents")
      .select("*")
      .eq("provider_id", provider?.id || "");
    
    setContents(data || []);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*");
    
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
      setMessage("Provider creato con successo!");
      fetchProvider();
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

    const { error } = await supabase
      .from("contents")
      .insert({
        provider_id: provider.id,
        category_id: categoryId,
        title,
        description,
        content_type: contentType as any,
        modality: modality as any,
        price_from: priceFrom,
        price_to: priceTo,
        city,
        published: true,
      });

    if (!error) {
      setMessage("Contenuto creato con successo!");
      setIsEditing(false);
      fetchContents();
    }
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto pt-8 px-4">
          <Card>
            <CardHeader>
              <CardTitle>Crea il tuo Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                createProvider(new FormData(e.currentTarget));
              }} className="space-y-4">
                <div>
                  <Label htmlFor="businessName">Nome Attività</Label>
                  <Input id="businessName" name="businessName" required />
                </div>
                <div>
                  <Label htmlFor="description">Descrizione</Label>
                  <Textarea id="description" name="description" />
                </div>
                <div>
                  <Label htmlFor="website">Sito Web</Label>
                  <Input id="website" name="website" type="url" />
                </div>
                <div>
                  <Label htmlFor="address">Indirizzo</Label>
                  <Input id="address" name="address" />
                </div>
                <div>
                  <Label htmlFor="city">Città</Label>
                  <Input id="city" name="city" />
                </div>
                <div>
                  <Label htmlFor="phone">Telefono</Label>
                  <Input id="phone" name="phone" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" />
                </div>
                <Button type="submit" className="w-full">
                  Crea Provider
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
      <Navigation />
      <div className="max-w-6xl mx-auto pt-8 px-4">
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard Provider</h1>
          <p className="text-gray-600">Benvenuto, {provider.business_name}</p>
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
                <p className="text-gray-600">Prenotazioni</p>
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
                Nuovo Contenuto
              </Button>
            </div>

            <div className="space-y-4">
              {contents.map((content) => (
                <Card key={content.id}>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{content.title}</h3>
                        <p className="text-gray-600 text-sm">{content.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>{content.city}</span>
                          <span>€{content.price_from} - €{content.price_to}</span>
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
              ))}
            </div>
          </div>

          {/* Create/Edit Content Form */}
          {isEditing && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Nuovo Contenuto</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    createContent(new FormData(e.currentTarget));
                  }} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Titolo</Label>
                      <Input id="title" name="title" required />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrizione</Label>
                      <Textarea id="description" name="description" />
                    </div>
                    <div>
                      <Label htmlFor="categoryId">Categoria</Label>
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
                      <Label htmlFor="contentType">Tipo</Label>
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
                      <Label htmlFor="modality">Modalità</Label>
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
                        <Label htmlFor="priceFrom">Prezzo da</Label>
                        <Input id="priceFrom" name="priceFrom" type="number" step="0.01" />
                      </div>
                      <div>
                        <Label htmlFor="priceTo">Prezzo a</Label>
                        <Input id="priceTo" name="priceTo" type="number" step="0.01" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="city">Città</Label>
                      <Input id="city" name="city" />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1">
                        Salva
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
