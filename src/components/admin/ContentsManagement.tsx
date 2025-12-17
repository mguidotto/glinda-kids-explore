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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Edit, Trash2, Eye, EyeOff, Image, Upload, X, Tag, Search, CalendarIcon, Clock, AlertCircle, ExternalLink, Hash } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ImageGalleryUpload from "./ImageGalleryUpload";
import AddressAutocomplete from "./AddressAutocomplete";
import { geocodeAddressWithCity } from "@/utils/geocoding";
import { generateSlug, ensureUniqueSlug } from "@/utils/slugUtils";

type Content = Database["public"]["Tables"]["contents"]["Row"] & {
  providers?: { business_name: string; verified: boolean };
  categories?: { name: string; slug: string };
  content_tags?: Array<{
    tags: { id: string; name: string; slug: string };
  }>;
};
type Category = Database["public"]["Tables"]["categories"]["Row"];
type TagType = Database["public"]["Tables"]["tags"]["Row"];
type Provider = Database["public"]["Tables"]["providers"]["Row"];

const ContentsManagement = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagType[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generatingSlugsBatch, setGeneratingSlugsBatch] = useState(false);
  const [slugProgress, setSlugProgress] = useState({ current: 0, total: 0 });
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [eventDate, setEventDate] = useState<Date | undefined>(undefined);
  const [eventEndDate, setEventEndDate] = useState<Date | undefined>(undefined);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    provider_id: "",
    city: "",
    address: "",
    price_from: "",
    published: false,
    featured: false,
    modality: "unspecified" as string,
    website: "",
    phone: "",
    email: "",
    featured_image: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    meta_image: "",
    event_time: "",
    event_end_time: "",
    latitude: null as number | null,
    longitude: null as number | null,
  });

  useEffect(() => {
    fetchContents();
    fetchCategories();
    fetchTags();
    fetchProviders();
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

  const fetchProviders = async () => {
    const { data } = await supabase
      .from("providers")
      .select("*")
      .order("business_name");
    
    if (data) {
      setProviders(data);
    }
  };

  // Auto-generate slug when title changes
  const handleTitleChange = async (title: string) => {
    setFormData(prev => ({ ...prev, title }));
    
    if (title.trim()) {
      const baseSlug = generateSlug(title);
      const uniqueSlug = await ensureUniqueSlug(baseSlug, editingContent?.id);
      setFormData(prev => ({ ...prev, slug: uniqueSlug }));
    } else {
      setFormData(prev => ({ ...prev, slug: "" }));
    }
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
        setError('Errore nel caricamento del file: ' + uploadError.message);
        return null;
      }

      const { data } = supabase.storage
        .from('content-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadFeaturedImage:', error);
      setError('Errore nel caricamento del file');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Per favore seleziona un file immagine');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('Il file deve essere più piccolo di 5MB');
        return;
      }
      
      setSelectedFile(file);
      setError(null);
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
      const { error: deleteError } = await supabase
        .from("content_tags")
        .delete()
        .eq("content_id", contentId);

      if (deleteError) {
        throw deleteError;
      }

      // Add new tags
      if (tagIds.length > 0) {
        const contentTags = tagIds.map(tagId => ({
          content_id: contentId,
          tag_id: tagId
        }));

        const { error: insertError } = await supabase
          .from("content_tags")
          .insert(contentTags);

        if (insertError) {
          throw insertError;
        }
      }
    } catch (error) {
      console.error("Error saving content tags:", error);
      throw error;
    }
  };

  const handleAddressChange = (address: string, coordinates?: { lat: number; lng: number }) => {
    setFormData(prev => ({
      ...prev,
      address,
      latitude: coordinates?.lat || null,
      longitude: coordinates?.lng || null
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setMessage(null);
      
      let featuredImageUrl = formData.featured_image;
      
      if (selectedFile) {
        const uploadedUrl = await uploadFeaturedImage(selectedFile);
        if (uploadedUrl) {
          featuredImageUrl = uploadedUrl;
        } else {
          setSaving(false);
          return;
        }
      }

      // Auto-geocode if coordinates are missing but address exists
      let coordinates = {
        latitude: formData.latitude,
        longitude: formData.longitude
      };

      if ((!formData.latitude || !formData.longitude) && formData.address) {
        console.log('Auto-geocoding address:', formData.address);
        const geocoded = await geocodeAddressWithCity(formData.address, formData.city);
        if (geocoded) {
          coordinates.latitude = geocoded.latitude;
          coordinates.longitude = geocoded.longitude;
          console.log('Geocoded coordinates:', geocoded);
        }
      }

      // Handle modality conversion - convert "unspecified" to null and validate enum values
      let modalityValue: "online" | "presenza" | "ibrido" | null = null;
      if (formData.modality && formData.modality !== "unspecified" && ["online", "presenza", "ibrido"].includes(formData.modality)) {
        modalityValue = formData.modality as "online" | "presenza" | "ibrido";
      }

      const contentData = {
        title: formData.title,
        description: formData.description || null,
        category_id: formData.category_id || null,
        provider_id: formData.provider_id === "none" ? null : formData.provider_id || null,
        city: formData.city || null,
        address: formData.address || null,
        price_from: formData.price_from || null,
        published: formData.published,
        featured: formData.featured,
        modality: modalityValue,
        website: formData.website || null,
        phone: formData.phone || null,
        email: formData.email || null,
        featured_image: featuredImageUrl || null,
        images: galleryImages,
        slug: formData.slug || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        meta_image: formData.meta_image || featuredImageUrl || null,
        event_date: eventDate ? eventDate.toISOString().split('T')[0] : null,
        event_time: formData.event_time || null,
        event_end_date: eventEndDate ? eventEndDate.toISOString().split('T')[0] : null,
        event_end_time: formData.event_end_time || null,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };

      console.log('Saving content data:', contentData);

      if (editingContent) {
        const { error } = await supabase
          .from("contents")
          .update(contentData)
          .eq("id", editingContent.id);

        if (error) {
          console.error('Update error:', error);
          throw new Error(`Errore nell'aggiornamento: ${error.message}`);
        }
        
        await saveContentTags(editingContent.id, selectedTags);
        
        setMessage("Contenuto aggiornato con successo!");
      } else {
        const { data, error } = await supabase
          .from("contents")
          .insert([contentData])
          .select()
          .single();

        if (error) {
          console.error('Insert error:', error);
          throw new Error(`Errore nella creazione: ${error.message}`);
        }
        
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
      const errorMessage = error instanceof Error ? error.message : "Errore sconosciuto nel salvare il contenuto";
      setError(errorMessage);
    } finally {
      setSaving(false);
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
      setError("Errore nell'eliminare il contenuto");
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
      provider_id: "",
      city: "",
      address: "",
      price_from: "",
      published: false,
      featured: false,
      modality: "unspecified",
      website: "",
      phone: "",
      email: "",
      featured_image: "",
      slug: "",
      meta_title: "",
      meta_description: "",
      meta_image: "",
      event_time: "",
      event_end_time: "",
      latitude: null,
      longitude: null,
    });
    setEditingContent(null);
    setSelectedFile(null);
    setSelectedTags([]);
    setEventDate(undefined);
    setEventEndDate(undefined);
    setGalleryImages([]);
    setError(null);
    setMessage(null);
  };

  const startEdit = (content: Content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      description: content.description || "",
      category_id: content.category_id || "",
      provider_id: content.provider_id || "",
      city: content.city || "",
      address: content.address || "",
      price_from: content.price_from || "",
      published: content.published ?? false,
      featured: content.featured ?? false,
      modality: content.modality || "unspecified", // Convert null to "unspecified"
      website: content.website || "",
      phone: content.phone || "",
      email: content.email || "",
      featured_image: content.featured_image || "",
      slug: content.slug || "",
      meta_title: content.meta_title || "",
      meta_description: content.meta_description || "",
      meta_image: content.meta_image || "",
      event_time: (content as any).event_time || "",
      event_end_time: (content as any).event_end_time || "",
      latitude: content.latitude || null,
      longitude: content.longitude || null,
    });
    
    // Set event dates
    if ((content as any).event_date) {
      setEventDate(new Date((content as any).event_date));
    }
    if ((content as any).event_end_date) {
      setEventEndDate(new Date((content as any).event_end_date));
    }
    
    // Set selected tags
    const contentTagIds = content.content_tags?.map(ct => ct.tags.id) || [];
    setSelectedTags(contentTagIds);
    
    // Set gallery images
    setGalleryImages(content.images || []);
    
    // Clear any previous messages
    setError(null);
    setMessage(null);
    
    setIsDialogOpen(true);
  };

  const generateContentUrl = (content: Content) => {
    // Debug logs to understand the routing issue
    console.log("[ContentsManagement] Generating URL for content:", {
      id: content.id,
      slug: content.slug,
      title: content.title,
      categorySlug: content.categories?.slug
    });
    
    // Use category/content slug pattern if both are available
    if (content.slug && content.categories?.slug) {
      const categoryContentUrl = `/${content.categories.slug}/${content.slug}`;
      console.log("[ContentsManagement] Generated category/content URL:", categoryContentUrl);
      return categoryContentUrl;
    }
    
    // Fallback to ID-based URL
    const idUrl = `/content/${content.id}`;
    console.log("[ContentsManagement] Generated ID URL:", idUrl);
    return idUrl;
  };

  const generateMissingSlugsBatch = async () => {
    try {
      setGeneratingSlugsBatch(true);
      setMessage("Ricerca contenuti senza slug...");
      
      // Get all contents without slug
      const { data: contentsWithoutSlug, error } = await supabase
        .from("contents")
        .select("id, title, slug")
        .or("slug.is.null,slug.eq.");

      if (error) {
        throw error;
      }

      if (!contentsWithoutSlug || contentsWithoutSlug.length === 0) {
        setMessage("Tutti i contenuti hanno già uno slug.");
        setGeneratingSlugsBatch(false);
        return;
      }

      const total = contentsWithoutSlug.length;
      setSlugProgress({ current: 0, total });
      setMessage(`Generazione slug per ${total} contenuti...`);

      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < contentsWithoutSlug.length; i++) {
        const content = contentsWithoutSlug[i];
        setSlugProgress({ current: i + 1, total });
        setMessage(`Generando slug: ${i + 1}/${total} - ${content.title}`);

        try {
          if (content.title) {
            const baseSlug = generateSlug(content.title);
            const uniqueSlug = await ensureUniqueSlug(baseSlug, content.id);

            const { error: updateError } = await supabase
              .from("contents")
              .update({ slug: uniqueSlug })
              .eq("id", content.id);

            if (updateError) {
              console.error(`Errore aggiornamento slug per ${content.title}:`, updateError);
              errorCount++;
            } else {
              successCount++;
            }
          } else {
            errorCount++;
          }
        } catch (slugError) {
          console.error(`Errore generazione slug per ${content.title}:`, slugError);
          errorCount++;
        }

        // Small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setMessage(`Generazione slug completata! ${successCount} generati con successo, ${errorCount} errori.`);
      fetchContents(); // Refresh the list
    } catch (error) {
      console.error("Error generating slugs:", error);
      setError("Errore durante la generazione degli slug");
    } finally {
      setGeneratingSlugsBatch(false);
      setSlugProgress({ current: 0, total: 0 });
    }
  };

  const batchGeocodeContents = async () => {
    try {
      setLoading(true);
      setMessage("Inizio geocodifica contenuti esistenti...");
      
      // Get all contents without coordinates but with address
      const { data: contentsToGeocode, error } = await supabase
        .from("contents")
        .select("id, address, city")
        .or("latitude.is.null,longitude.is.null")
        .not("address", "is", null);

      if (error) {
        throw error;
      }

      if (!contentsToGeocode || contentsToGeocode.length === 0) {
        setMessage("Nessun contenuto da geocodificare trovato.");
        setLoading(false);
        return;
      }

      let geocodedCount = 0;
      const total = contentsToGeocode.length;

      for (const content of contentsToGeocode) {
        if (content.address) {
          const geocoded = await geocodeAddressWithCity(content.address, content.city || "");
          
          if (geocoded) {
            const { error: updateError } = await supabase
              .from("contents")
              .update({
                latitude: geocoded.latitude,
                longitude: geocoded.longitude
              })
              .eq("id", content.id);

            if (!updateError) {
              geocodedCount++;
            }
          }
          
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      }

      setMessage(`Geocodifica completata! ${geocodedCount}/${total} contenuti aggiornati.`);
      fetchContents(); // Refresh the list
    } catch (error) {
      console.error("Error batch geocoding:", error);
      setError("Errore durante la geocodifica batch dei contenuti");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento contenuti...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold">Gestione Contenuti</CardTitle>
            <p className="text-gray-600 text-sm mt-1">Modifica tutti i contenuti della piattaforma</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={generateMissingSlugsBatch}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              disabled={loading || generatingSlugsBatch}
            >
              <Hash className="h-4 w-4 mr-2" />
              {generatingSlugsBatch ? 
                `Generando... ${slugProgress.current}/${slugProgress.total}` : 
                "Genera Slug Mancanti"
              }
            </Button>
            
            <Button 
              onClick={batchGeocodeContents}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              disabled={loading || generatingSlugsBatch}
            >
              Geocodifica Contenuti Esistenti
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={resetForm}
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Nuovo Contenuto
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl font-semibold">
                    {editingContent ? "Modifica Contenuto" : "Nuovo Contenuto"}
                  </DialogTitle>
                </DialogHeader>
                
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert className="mb-4">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Informazioni Base</h3>
                    
                    <div>
                      <Label htmlFor="title">Titolo *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
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

                    {/* Featured Image */}
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

                    {/* Image Gallery */}
                    <ImageGalleryUpload
                      images={galleryImages}
                      onImagesChange={setGalleryImages}
                    />

                    {/* Tags */}
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

                  {/* Event Date/Time Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5" />
                      <h3 className="text-lg font-semibold">Data e Ora Evento</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Data Inizio</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !eventDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {eventDate ? format(eventDate, "dd/MM/yyyy") : "Seleziona data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={eventDate}
                              onSelect={setEventDate}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="event_time">Ora Inizio</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="event_time"
                            type="time"
                            value={formData.event_time}
                            onChange={(e) => setFormData(prev => ({ ...prev, event_time: e.target.value }))}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Data Fine</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !eventEndDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {eventEndDate ? format(eventEndDate, "dd/MM/yyyy") : "Seleziona data"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={eventEndDate}
                              onSelect={setEventEndDate}
                              initialFocus
                              className="pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label htmlFor="event_end_time">Ora Fine</Label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="event_end_time"
                            type="time"
                            value={formData.event_end_time}
                            onChange={(e) => setFormData(prev => ({ ...prev, event_end_time: e.target.value }))}
                            className="pl-10"
                          />
                        </div>
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
                      <Label htmlFor="slug">URL Slug *</Label>
                      <Input
                        id="slug"
                        placeholder="url-del-contenuto"
                        value={formData.slug}
                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        L'URL sarà: /categoria/{formData.slug || "url-del-contenuto"}
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
                      <Label htmlFor="provider">Provider</Label>
                      <Select
                        value={formData.provider_id}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, provider_id: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Nessun provider</SelectItem>
                          {providers.map((provider) => (
                            <SelectItem key={provider.id} value={provider.id}>
                              {provider.business_name}
                              {provider.verified && " ✓"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="modality">Modalità</Label>
                      <Select
                        value={formData.modality}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, modality: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleziona modalità (opzionale)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unspecified">Non specificata</SelectItem>
                          <SelectItem value="presenza">In Presenza</SelectItem>
                          <SelectItem value="online">Online</SelectItem>
                          <SelectItem value="ibrido">Ibrida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Address with Autocomplete */}
                    <AddressAutocomplete
                      value={formData.address}
                      onChange={handleAddressChange}
                      placeholder="Cerca e seleziona un indirizzo..."
                      label="Indirizzo"
                    />

                    <div>
                      <Label htmlFor="city">Città</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      />
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

                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6 border-t">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="w-full sm:w-auto px-6 py-2"
                      disabled={saving}
                    >
                      Annulla
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={uploading || saving}
                      className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-2"
                    >
                      {uploading ? "Caricamento immagine..." : saving ? "Salvataggio..." : editingContent ? "Aggiorna Contenuto" : "Crea Contenuto"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {contents.map((content) => (
            <div key={content.id} className="bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-base sm:text-lg truncate">{content.title}</h3>
                    <Badge variant={content.published ? "default" : "secondary"}>
                      {content.published ? "Pubblicato" : "Bozza"}
                    </Badge>
                    {content.featured && (
                      <Badge variant="outline">In Evidenza</Badge>
                    )}
                    {content.featured_image && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Image className="h-3 w-3" />
                        <span className="hidden sm:inline">Immagine</span>
                      </Badge>
                    )}
                  </div>
                  
                  {content.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{content.description}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-gray-500">
                    {content.modality && <span>Modalità: {content.modality}</span>}
                    {content.categories && (
                      <span>Categoria: {content.categories.name}</span>
                    )}
                    {content.providers && (
                      <span>Provider: {content.providers.business_name}</span>
                    )}
                    {content.city && <span>Città: {content.city}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const url = generateContentUrl(content);
                      console.log("[ContentsManagement] Opening URL:", url);
                      window.open(url, '_blank');
                    }}
                    className="px-3 py-2"
                    title="Visualizza contenuto"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublished(content.id, content.published ?? false)}
                    className="px-3 py-2"
                  >
                    {content.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(content)}
                    className="px-3 py-2"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteContent(content.id)}
                    className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentsManagement;
