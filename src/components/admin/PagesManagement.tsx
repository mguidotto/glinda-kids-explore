
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Save } from "lucide-react";

const PagesManagement = () => {
  const [aboutData, setAboutData] = useState({
    title: "",
    content: ""
  });
  const [contactData, setContactData] = useState({
    title: "",
    content: "",
    email: "",
    phone: "",
    address: ""
  });
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPageData();
  }, []);

  const fetchPageData = async () => {
    const { data } = await supabase
      .from("app_texts")
      .select("*")
      .eq("category", "pages");

    if (data) {
      const aboutTitle = data.find(item => item.key === "about.title")?.value || "";
      const aboutContent = data.find(item => item.key === "about.content")?.value || "";
      const contactTitle = data.find(item => item.key === "contact.title")?.value || "";
      const contactContent = data.find(item => item.key === "contact.content")?.value || "";
      const contactEmail = data.find(item => item.key === "contact.email")?.value || "";
      const contactPhone = data.find(item => item.key === "contact.phone")?.value || "";
      const contactAddress = data.find(item => item.key === "contact.address")?.value || "";

      setAboutData({ title: aboutTitle, content: aboutContent });
      setContactData({ 
        title: contactTitle, 
        content: contactContent,
        email: contactEmail,
        phone: contactPhone,
        address: contactAddress
      });
    }
  };

  const updatePageText = async (key: string, value: string) => {
    const { error } = await supabase.rpc("update_app_text", {
      text_key: key,
      new_value: value
    });

    if (error) {
      console.error("Error updating text:", error);
      throw error;
    }
  };

  const saveAboutPage = async () => {
    setLoading(true);
    try {
      await updatePageText("about.title", aboutData.title);
      await updatePageText("about.content", aboutData.content);
      setMessage("Pagina Chi Siamo aggiornata con successo!");
    } catch (error) {
      setMessage("Errore nell'aggiornamento della pagina");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const saveContactPage = async () => {
    setLoading(true);
    try {
      await updatePageText("contact.title", contactData.title);
      await updatePageText("contact.content", contactData.content);
      await updatePageText("contact.email", contactData.email);
      await updatePageText("contact.phone", contactData.phone);
      await updatePageText("contact.address", contactData.address);
      setMessage("Pagina Contattaci aggiornata con successo!");
    } catch (error) {
      setMessage("Errore nell'aggiornamento della pagina");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Gestione Pagine
        </CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="about">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">Chi Siamo</TabsTrigger>
            <TabsTrigger value="contact">Contattaci</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-4">
            <div>
              <Label htmlFor="aboutTitle">Titolo Pagina</Label>
              <Input
                id="aboutTitle"
                value={aboutData.title}
                onChange={(e) => setAboutData({...aboutData, title: e.target.value})}
                placeholder="Chi Siamo"
              />
            </div>
            
            <div>
              <Label htmlFor="aboutContent">Contenuto</Label>
              <Textarea
                id="aboutContent"
                value={aboutData.content}
                onChange={(e) => setAboutData({...aboutData, content: e.target.value})}
                rows={8}
                placeholder="Descrizione della vostra azienda..."
              />
            </div>
            
            <Button 
              onClick={saveAboutPage} 
              disabled={loading}
              className="bg-[#8B4A6B] hover:bg-[#7A4060]"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvataggio..." : "Salva Chi Siamo"}
            </Button>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <div>
              <Label htmlFor="contactTitle">Titolo Pagina</Label>
              <Input
                id="contactTitle"
                value={contactData.title}
                onChange={(e) => setContactData({...contactData, title: e.target.value})}
                placeholder="Contattaci"
              />
            </div>
            
            <div>
              <Label htmlFor="contactContent">Contenuto Introduttivo</Label>
              <Textarea
                id="contactContent"
                value={contactData.content}
                onChange={(e) => setContactData({...contactData, content: e.target.value})}
                rows={4}
                placeholder="Messaggio di benvenuto nella pagina contatti..."
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactData.email}
                  onChange={(e) => setContactData({...contactData, email: e.target.value})}
                  placeholder="info@example.com"
                />
              </div>
              
              <div>
                <Label htmlFor="contactPhone">Telefono</Label>
                <Input
                  id="contactPhone"
                  value={contactData.phone}
                  onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                  placeholder="+39 02 1234 5678"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="contactAddress">Indirizzo</Label>
              <Input
                id="contactAddress"
                value={contactData.address}
                onChange={(e) => setContactData({...contactData, address: e.target.value})}
                placeholder="Via Roma 123, 20121 Milano (MI)"
              />
            </div>
            
            <Button 
              onClick={saveContactPage} 
              disabled={loading}
              className="bg-[#8B4A6B] hover:bg-[#7A4060]"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Salvataggio..." : "Salva Contattaci"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PagesManagement;
