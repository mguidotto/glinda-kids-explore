import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Category = Database["public"]["Tables"]["categories"]["Row"];

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "",
    color: "",
    active: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true })
      .order("name", { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Update existing category
        const { error } = await supabase.rpc('update_category', {
          category_id: editingCategory.id,
          category_name: formData.name,
          category_slug: formData.slug,
          category_description: formData.description || null,
          category_icon: formData.icon || null,
          category_color: formData.color || null,
          category_active: formData.active
        });

        if (error) throw error;
        setMessage("Categoria aggiornata con successo!");
      } else {
        // Create new category
        const { error } = await supabase.rpc('create_category', {
          category_name: formData.name,
          category_slug: formData.slug,
          category_description: formData.description || null,
          category_icon: formData.icon || null,
          category_color: formData.color || null
        });

        if (error) throw error;
        setMessage("Categoria creata con successo!");
      }

      resetForm();
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      setMessage("Errore nel salvare la categoria");
    }
  };

  const deleteCategory = async (categoryId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questa categoria?")) return;

    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId)
        .eq("editable", true);

      if (error) throw error;
      setMessage("Categoria eliminata con successo!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      setMessage("Errore nell'eliminare la categoria");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      description: "",
      icon: "",
      color: "",
      active: true
    });
    setEditingCategory(null);
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      icon: category.icon || "",
      color: category.color || "",
      active: category.active ?? true
    });
    setIsDialogOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  if (loading) {
    return <div>Caricamento categorie...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Gestione Categorie</CardTitle>
            <p className="text-gray-600 text-sm">Modifica le categorie di ricerca disponibili</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                size="lg"
                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Modifica Categoria" : "Nuova Categoria"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
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
                        slug: generateSlug(name)
                      }));
                    }}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
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
                  <Label htmlFor="icon">Icona (classe Lucide)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="es. BookOpen, Calendar, Users"
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                  />
                  <Label htmlFor="active">Attiva</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annulla
                  </Button>
                  <Button type="submit">
                    {editingCategory ? "Aggiorna" : "Crea"}
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

        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{category.name}</h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">{category.slug}</span>
                  {!category.active && (
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                      Disattivata
                    </span>
                  )}
                </div>
                {category.description && (
                  <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                )}
                {category.color && (
                  <div className="flex items-center gap-2 mt-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-xs text-gray-500">{category.color}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                {category.editable && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {!category.editable && (
                  <span className="text-xs text-gray-500">Sistema</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoriesManagement;
