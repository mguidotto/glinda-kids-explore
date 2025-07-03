
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, AlertCircle, Hash } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Tag = Database["public"]["Tables"]["tags"]["Row"];

const TagsManagement = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
  });

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("name");

    if (!error && data) {
      setTags(data);
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

      const tagData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name),
      };

      if (editingTag) {
        const { error } = await supabase
          .from("tags")
          .update(tagData)
          .eq("id", editingTag.id);

        if (error) throw error;
        setMessage("Tag aggiornato con successo!");
      } else {
        const { error } = await supabase
          .from("tags")
          .insert([tagData]);

        if (error) throw error;
        setMessage("Tag creato con successo!");
      }

      resetForm();
      setIsDialogOpen(false);
      fetchTags();
    } catch (error) {
      console.error("Error saving tag:", error);
      setError("Errore nel salvare il tag");
    } finally {
      setSaving(false);
    }
  };

  const deleteTag = async (tagId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo tag?")) return;

    try {
      const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", tagId);

      if (error) throw error;
      setMessage("Tag eliminato con successo!");
      fetchTags();
    } catch (error) {
      console.error("Error deleting tag:", error);
      setError("Errore nell'eliminare il tag");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
    });
    setEditingTag(null);
    setError(null);
    setMessage(null);
  };

  const startEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
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
          <p className="text-gray-600">Caricamento tag...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <CardTitle className="text-xl sm:text-2xl font-bold">Gestione Tag</CardTitle>
            <p className="text-gray-600 text-sm mt-1">Organizza i contenuti con etichette tematiche</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nuovo Tag
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-semibold">
                  {editingTag ? "Modifica Tag" : "Nuovo Tag"}
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
                    placeholder="tag-esempio"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'URL sarà: /tag/{formData.slug || "tag-esempio"}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t">
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
                    {saving ? "Salvataggio..." : editingTag ? "Aggiorna Tag" : "Crea Tag"}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {tags.map((tag) => (
            <div key={tag.id} className="bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Hash className="h-4 w-4 text-gray-400" />
                  <h3 className="font-semibold text-sm truncate">{tag.name}</h3>
                </div>
              </div>
              
              <p className="text-xs text-gray-500 mb-3">/{tag.slug}</p>
              
              <div className="flex items-center justify-end gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(tag)}
                  className="px-2 py-1 h-7"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteTag(tag.id)}
                  className="px-2 py-1 h-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TagsManagement;
