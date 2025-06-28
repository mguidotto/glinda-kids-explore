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
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Eye, EyeOff, Image, Upload, X, Tag, Search } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Content = Database["public"]["Tables"]["contents"]["Row"] & {
  providers?: { business_name: string; verified: boolean };
  categories?: { name: string; slug: string };
  content_tags?: Array<{
    tags: { id: string; name: string; slug: string };
  }>;
};
type Category = Database["public"]["Tables"]["categories"]["Row"];
type TagType = Database["public"]["Tables"]["tags"]["Row"];

const ContentsManagement = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
    modality: "presenza" as Database["public"]["Enums"]["modality"],
    website: "",
    phone: "",
    email: "",
    featured_image: "",
    // SEO fields
    slug: "",
    meta_title: "",
    meta_description: "",
    meta_image: ""
  });

  useEffect(() => {
    fetchContents();
    fetchCategories();
    fetchTags();
  }, []);

  const fetchContents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contents")
      .select(`
        *,
        providers(business_name, verified),
        categories(name, slug),
        content_tags(tags(id, name, slug))
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

  const fetchTags = async () => {
    const { data } = await supabase
      .from("tags")
      .select("*")
      .order("name");
    
    if (data) {
      setTags(data);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const uploadFeaturedImage = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `featured/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        setMessage('Errore nel caricamento del file');
        return null;
      }

      const { data } = supabase.storage
        .from('content-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadFeaturedImage:', error);
      setMessage('Errore nel caricamento del file');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage('Per favore seleziona un file immagine');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setMessage('Il file deve essere più piccolo di 5MB');
        return;
      }
      
      setSelectedFile(file);
      setMessage(null);
    }
  };

  const handleRemoveImage = async () => {
    if (formData.featured_image) {
      try {
        const url = new URL(formData.featured_image);
        const filePath = url.pathname.split('/').slice(-2).join('/');
        
        await supabase.storage
          .from('content-images')
          .remove([filePath]);
      } catch (error) {
        console.error('Error removing old image:', error);
      }
    }
    
    setFormData(prev => ({ ...prev, featured_image: "" }));
    setSelectedFile(null);
  };

  const handleTagToggle = (tagId: string, checked: boolean) => {
    if (checked) {
      setSelectedTags(prev => [...prev, tagId]);
    } else {
      setSelectedTags(prev => prev.filter(id => id !== tagId));
    }
  };

  const saveContentTags = async (contentId: string, tagIds: string[]) => {
    try {
      // Remove existing tags
      await supabase
        .from("content_tags")
        .delete()
        .eq("content_id", contentId);

      // Add new tags
      if (tagIds.length > 0) {
        const contentTags = tagIds.map(tagId => ({
          content_id: contentId,
          tag_id: tagId
        }));

        await supabase
          .from("content_tags")
          .insert(contentTags);
      }
    } catch (error) {
      console.error("Error saving content tags:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let featuredImageUrl = formData.featured_image;
      
      if (selectedFile) {
        const uploadedUrl = await uploadFeaturedImage(selectedFile);
        if (uploadedUrl) {
          featuredImageUrl = uploadedUrl;
        } else {
          return;
        }
      }

      const contentData = {
        ...formData,
        price_from: formData.price_from ? parseFloat(formData.price_from) : null,
        price_to: formData.price_to ? parseFloat(formData.price_to) : null,
        category_id: formData.category_id || null,
        featured_image: featuredImageUrl || null,
        // SEO fields
        slug: formData.slug || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        meta_image: formData.meta_image || featuredImageUrl || null,
      };

      if (editingContent) {
        const { error } = await supabase
          .from("contents")
          .update(contentData)
          .eq("id", editingContent.id);

        if (error) throw error;
        
        // Save tags
        await saveContentTags(editingContent.id, selectedTags);
        
        setMessage("Contenuto aggiornato con successo!");
      } else {
        const { data, error } = await supabase
          .from("contents")
          .insert([contentData])
          .select()
          .single();

        if (error) throw error;
        
        // Save tags for new content
        if (data) {
          await saveContentTags(data.id, selectedTags);
        }
        
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
      modality: "presenza",
      website: "",
      phone: "",
      email: "",
      featured_image: "",
      slug: "",
      meta_title: "",
      meta_description: "",
      meta_image: ""
    });
    setEditingContent(null);
    setSelectedFile(null);
    setSelectedTags([]);
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
      modality: content.modality,
      website: content.website || "",
      phone: content.phone || "",
      email: content.email || "",
      featured_image: content.featured_image || "",
      slug: content.slug || "",
      meta_title: content.meta_title || "",
      meta_description: content.meta_description || "",
      meta_image: content.meta_image || ""
    });
    
    // Set selected tags
    const contentTagIds = content.content_tags?.map(ct => ct.tags.id) || [];
    setSelectedTags(contentTagIds);
    
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingContent ? "Modifica Contenuto" : "Nuovo Contenuto"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informazioni Base</h3>
                
                <div>
                  <Label htmlFor="title">Titolo *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setFormData(prev => ({ 
                        ...prev, 
                        title,
                        slug: prev.slug || generateSlug(title)
                      }));
                    }}
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
                  <Label htmlFor="featured_image">Immagine in Evidenza</Label>
                  
                  {formData.featured_image && (
                    <div className="mt-2 mb-4">
                      <div className="relative inline-block">
                        <img 
                          src={formData.featured_image} 
                          alt="Immagine in evidenza" 
                          className="w-32 h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={handleRemoveImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Input
                      id="featured_image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-gray-500">
                      Formati supportati: JPG, PNG, GIF. Dimensione massima: 5MB
                    </p>
                    
                    {selectedFile && (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <Upload className="h-4 w-4" />
                        File selezionato: {selectedFile.name}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Tag</Label>
                  <div className="mt-2 max-h-32 overflow-y-auto border rounded-md p-3 space-y-2">
                    {tags.map((tag) => (
                      <div key={tag.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`tag-${tag.id}`}
                          checked={selectedTags.includes(tag.id)}
                          onCheckedChange={(checked) => handleTagToggle(tag.id, checked as boolean)}
                        />
                        <Label htmlFor={`tag-${tag.id}`} className="text-sm font-normal">
                          {tag.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Separator />

              {/* SEO Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">SEO e Meta Tag</h3>
                </div>
                
                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    placeholder="url-del-contenuto"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'URL sarà: /content/{formData.slug || "url-del-contenuto"}
                  </p>
                </div>

                <div>
                  <Label htmlFor="meta_title">Meta Title</Label>
                  <Input
                    id="meta_title"
                    placeholder="Titolo SEO personalizzato (max 60 caratteri)"
                    value={formData.meta_title}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.meta_title.length}/60 caratteri
                  </p>
                </div>

                <div>
                  <Label htmlFor="meta_description">Meta Description</Label>
                  <Textarea
                    id="meta_description"
                    placeholder="Descrizione SEO personalizzata (max 160 caratteri)"
                    value={formData.meta_description}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.meta_description.length}/160 caratteri
                  </p>
                </div>

                <div>
                  <Label htmlFor="meta_image">Immagine Social (URL)</Label>
                  <Input
                    id="meta_image"
                    placeholder="URL immagine per condivisioni social"
                    value={formData.meta_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, meta_image: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Se vuoto, verrà usata l'immagine in evidenza
                  </p>
                </div>
              </div>

              <Separator />

              {/* Category and Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Categoria e Dettagli</h3>
                
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
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Caricamento..." : editingContent ? "Aggiorna" : "Crea"}
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
                  {content.featured_image && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Image className="h-3 w-3" />
                      Immagine
                    </Badge>
                  )}
                  {content.slug && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Search className="h-3 w-3" />
                      SEO
                    </Badge>
                  )}
                </div>
                {content.description && (
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{content.description}</p>
                )}
                
                {/* Show tags */}
                {content.content_tags && content.content_tags.length > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    <Tag className="h-3 w-3 text-gray-500" />
                    <div className="flex flex-wrap gap-1">
                      {content.content_tags.map((ct) => (
                        <Badge key={ct.tags.id} variant="secondary" className="text-xs">
                          {ct.tags.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-4 text-xs text-gray-500">
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
                  {content.slug && <span>URL: /{content.slug}</span>}
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
