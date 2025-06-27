
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Tag = Database["public"]["Tables"]["tags"]["Row"];

const TagsManagement = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: ""
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
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const slug = formData.slug || generateSlug(formData.name);
      
      const tagData = {
        name: formData.name,
        slug: slug
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
      setMessage("Errore nel salvare il tag");
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
      setMessage("Errore nell'eliminare il tag");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: ""
    });
    setEditingTag(null);
  };

  const startEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug
    });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div>Caricamento tag...</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Gestione Tag</CardTitle>
          <p className="text-gray-600 text-sm">Crea e gestisci i tag per i contenuti</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Nuovo Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingTag ? "Modifica Tag" : "Nuovo Tag"}
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
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="Generato automaticamente dal nome"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annulla
                </Button>
                <Button type="submit">
                  {editingTag ? "Aggiorna" : "Crea"}
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

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center gap-2 p-2 border rounded-lg">
              <Badge variant="outline">{tag.name}</Badge>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => startEdit(tag)}
                  className="h-6 w-6 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTag(tag.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
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
