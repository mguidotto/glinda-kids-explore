
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Edit, Trash2, Eye, EyeOff, AlertCircle, Tag } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "",
    active: true,
    display_order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  const generateSlug = (name: string) => {
    return name
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const categoryData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
      };

      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", editingCategory.id);

        if (error) throw error;
        setMessage("Categoria aggiornata con successo!");
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([categoryData]);

        if (error) throw error;
        setMessage("Categoria creata con successo!");
      }

      resetForm();
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      setError("Errore nel salvare la categoria");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa categoria?")) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;
      setMessage("Categoria eliminata con successo!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      setError("Errore nell'eliminare la categoria");
    }
  };

  const toggleActive = async (categoryId: string, active: boolean) => {
    try {
      const { error } = await supabase
        .from("categories")
        .update({ active: !active })
        .eq("id", categoryId);

      if (error) throw error;
      fetchCategories();
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      color: "",
      active: true,
      display_order: 0,
    });
    setEditingCategory(null);
    setError(null);
    setMessage(null);
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "",
      color: category.color || "",
      active: category.active ?? true,
      display_order: category.display_order ?? 0,
    });
    setError(null);
    setMessage(null);
    setIsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento categorie...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold">Gestione Categorie</CardTitle>
            <p className="text-gray-600 text-sm mt-1">Organizza i contenuti per categoria</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-semibold">
                  {editingCategory ? "Modifica Categoria" : "Nuova Categoria"}
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
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData(prev => ({ 
                          ...prev, 
                          name,
                          slug: prev.slug || generateSlug(name)
                        }));
                      }}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug URL</Label>
                    <Input
                      id="slug"
                      placeholder="categoria-esempio"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      L'URL sarà: /categoria/{formData.slug || "categoria-esempio"}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrizione</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="icon">Icona</Label>
                      <Input
                        id="icon"
                        placeholder="lucide-react icon name"
                        value={formData.icon}
                        onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="color">Colore</Label>
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="display_order">Ordine di visualizzazione</Label>
                    <Input
                      id="display_order"
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                    />
                    <Label htmlFor="active">Categoria attiva</Label>
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
                    disabled={saving}
                    className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-6 py-2"
                  >
                    {saving ? "Salvataggio..." : editingCategory ? "Aggiorna Categoria" : "Crea Categoria"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {category.icon && (
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" 
                         style={{ backgroundColor: category.color || '#e5e7eb' }}>
                      <Tag className="h-4 w-4" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-base">{category.name}</h3>
                    <p className="text-xs text-gray-500">/{category.slug}</p>
                  </div>
                </div>
                <Badge variant={category.active ? "default" : "secondary"}>
                  {category.active ? "Attiva" : "Inattiva"}
                </Badge>
              </div>
              
              {category.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{category.description}</p>
              )}
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Ordine: {category.display_order}</span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleActive(category.id, category.active ?? false)}
                    className="px-2 py-1 h-8"
                  >
                    {category.active ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => startEdit(category)}
                    className="px-2 py-1 h-8"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCategory(category.id)}
                    className="px-2 py-1 h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
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

export default CategoriesManagement;
