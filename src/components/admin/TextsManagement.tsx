
import { useState, useEffect } from "react";
import { useAppTexts } from "@/hooks/useAppTexts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, Edit2, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TextsManagement = () => {
  const { texts, loading, updateText, getText } = useAppTexts();
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const uniqueCategories = [...new Set(texts.map(t => t.category || 'general'))];
    setCategories(uniqueCategories);
  }, [texts]);

  const handleStartEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setEditValue(currentValue);
  };

  const handleSaveEdit = async () => {
    if (!editingKey) return;

    const { error } = await updateText(editingKey, editValue);
    if (!error) {
      setMessage("Testo aggiornato con successo!");
      setEditingKey(null);
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage("Errore durante l'aggiornamento del testo");
    }
  };

  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditValue("");
  };

  if (loading) {
    return <div>Caricamento testi...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{getText('admin.texts.title', 'Gestione Testi')}</CardTitle>
        <p className="text-gray-600">
          {getText('admin.texts.description', 'Modifica tutti i testi e le etichette dell\'applicazione')}
        </p>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {categories.map(category => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 capitalize border-b pb-2">
              {category}
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chiave</TableHead>
                  <TableHead>Valore</TableHead>
                  <TableHead>Descrizione</TableHead>
                  <TableHead className="w-20">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {texts
                  .filter(text => (text.category || 'general') === category)
                  .map((text) => (
                    <TableRow key={text.id}>
                      <TableCell className="font-mono text-sm">
                        {text.key}
                      </TableCell>
                      <TableCell>
                        {editingKey === text.key ? (
                          <div className="space-y-2">
                            {text.value.length > 50 ? (
                              <Textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="min-h-20"
                              />
                            ) : (
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                              />
                            )}
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleSaveEdit}>
                                <Save className="h-4 w-4 mr-1" />
                                Salva
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                <X className="h-4 w-4 mr-1" />
                                Annulla
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="max-w-md">
                            {text.value.length > 100 ? (
                              <p className="text-sm">{text.value.substring(0, 100)}...</p>
                            ) : (
                              <p>{text.value}</p>
                            )}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {text.description}
                      </TableCell>
                      <TableCell>
                        {editingKey !== text.key && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStartEdit(text.key, text.value)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TextsManagement;
