
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Content = Database["public"]["Tables"]["contents"]["Row"] & {
  providers?: { business_name: string; verified: boolean };
  categories?: { name: string; slug: string };
};
type Category = Database["public"]["Tables"]["categories"]["Row"];

const ContentsManagement = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    city: "",
    address: "",
    price_from: "",
    price_to: "",
    published: false,
    featured: false,
    content_type: "corso" as Database["public"]["Enums"]["content_type"],
    modality: "presenza" as Database["public"]["Enums"]["modality"],
    website: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    fetchContents();
    fetchCategories();
  }, []);

  const fetchContents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contents")
      .select(`
        *,
        providers(business_name, verified),
        categories(name, slug)
      `)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setContents(data as any);
    }
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("name");
    
    if (data) {
      setCategories(data);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const contentData = {
        ...formData,
        price_from: formData.price_from ? parseFloat(formData.price_from) : null,
        price_to: formData.price_to ? parseFloat(formData.price_to) : null,
        category_id: formData.category_id || null,
      };

      if (editingContent) {
        const { error } = await supabase
          .from("contents")
          .update(contentData)
          .eq("id", editingContent.id);

        if (error) throw error;
        setMessage("Contenuto aggiornato con successo!");
      } else {
        const { error } = await supabase
          .from("contents")
          .insert([contentData]);

        if (error) throw error;
        setMessage("Contenuto creato con successo!");
      }

      resetForm();
      setIsDialogOpen(false);
      fetchContents();
    } catch (error) {
      console.error("Error saving content:", error);
      setMessage("Errore nel salvare il contenuto");
    }
  };

  const deleteContent = async (contentId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo contenuto?")) return;

    try {
      const { error } = await supabase
        .from("contents")
        .delete()
        .eq("id", contentId);

      if (error) throw error;
      setMessage("Contenuto eliminato con successo!");
      fetchContents();
    } catch (error) {
      console.error("Error deleting content:", error);
      setMessage("Errore nell'eliminare il contenuto");
    }
  };

  const togglePublished = async (contentId: string, published: boolean) => {
    try {
      const { error } = await supabase
        .from("contents")
        .update({ published: !published })
        .eq("id", contentId);

      if (error) throw error;
      fetchContents();
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category_id: "",
      city: "",
      address: "",
      price_from: "",
      price_to: "",
      published: false,
      featured: false,
      content_type: "corso",
      modality: "presenza",
      website: "",
      phone: "",
      email: ""
    });
    setEditingContent(null);
  };

  const startEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      description: content.description || "",
      category_id: content.category_id || "",
      city: content.city || "",
      address: content.address || "",
      price_from: content.price_from?.toString() || "",
      price_to: content.price_to?.toString() || "",
      published: content.published ?? false,
      featured: content.featured ?? false,
      content_type: content.content_type,
      modality: content.modality,
      website: content.website || "",
      phone: content.phone || "",
      email: content.email || ""
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Caricamento contenuti...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestione Contenuti</CardTitle>
          <p className="text-gray-600 text-sm">Modifica tutti i contenuti della piattaforma</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Contenuto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? "Modifica Contenuto" : "Nuovo Contenuto"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Titolo *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="content_type">Tipo</Label>
                  <Select
                    value={formData.content_type}
                    onValueChange={(value: Database["public"]["Enums"]["content_type"]) => setFormData(prev => ({ ...prev, content_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="corso">Corso</SelectItem>
                      <SelectItem value="evento">Evento</SelectItem>
                      <SelectItem value="servizio">Servizio</SelectItem>
                      <SelectItem value="centro">Centro</SelectItem>
                      <SelectItem value="campo_estivo">Campo Estivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="modality">Modalità</Label>
                  <Select
                    value={formData.modality}
                    onValueChange={(value: Database["public"]["Enums"]["modality"]) => setFormData(prev => ({ ...prev, modality: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presenza">In Presenza</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="ibrido">Ibrida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Città</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="address">Indirizzo</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price_from">Prezzo Da (€)</Label>
                  <Input
                    id="price_from"
                    type="number"
                    step="0.01"
                    value={formData.price_from}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_from: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="price_to">Prezzo A (€)</Label>
                  <Input
                    id="price_to"
                    type="number"
                    step="0.01"
                    value={formData.price_to}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_to: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="website">Sito Web</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Telefono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                  />
                  <Label htmlFor="published">Pubblicato</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                  />
                  <Label htmlFor="featured">In Evidenza</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit">
                  {editingContent ? "Aggiorna" : "Crea"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {contents.map((content) => (
            <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{content.title}</h3>
                  <Badge variant={content.published ? "default" : "secondary"}>
                    {content.published ? "Pubblicato" : "Bozza"}
                  </Badge>
                  {content.featured && (
                    <Badge variant="outline">In Evidenza</Badge>
                  )}
                </div>
                {content.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{content.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Tipo: {content.content_type}</span>
                  <span>Modalità: {content.modality}</span>
                  {content.categories && (
                    <span>Categoria: {content.categories.name}</span>
                  )}
                  {content.city && <span>Città: {content.city}</span>}
                  {content.price_from && (
                    <span>
                      Prezzo: €{content.price_from}
                      {content.price_to && content.price_to !== content.price_from && ` - €${content.price_to}`}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => togglePublished(content.id, content.published ?? false)}
                >
                  {content.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(content)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteContent(content.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentsManagement;
