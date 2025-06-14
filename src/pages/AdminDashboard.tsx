import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, FileText, Building, Type } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import Navigation from "@/components/Navigation";
import { Navigate } from "react-router-dom";
import TextsManagement from "@/components/admin/TextsManagement";

type Provider = Database["public"]["Tables"]["providers"]["Row"];
type Content = Database["public"]["Tables"]["contents"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const AdminDashboard = () => {
  const { user, profile, loading } = useAuth();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [message, setMessage] = useState<string | null>(null);

  // Redirect if not admin
  if (!loading && (!profile || profile.role !== 'admin')) {
    return <Navigate to="/auth" replace />;
  }

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchAllData();
    }
  }, [user, profile]);

  const fetchAllData = async () => {
    // Fetch providers
    const { data: providersData } = await supabase
      .from("providers")
      .select("*")
      .order("created_at", { ascending: false });
    
    // Fetch contents
    const { data: contentsData } = await supabase
      .from("contents")
      .select(`
        *,
        providers(business_name),
        categories(name)
      `)
      .order("created_at", { ascending: false });
    
    // Fetch categories
    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    
    // Fetch users
    const { data: usersData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    setProviders(providersData || []);
    setContents(contentsData || []);
    setCategories(categoriesData || []);
    setUsers(usersData || []);
  };

  const toggleProviderVerification = async (providerId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("providers")
      .update({ verified: !currentStatus })
      .eq("id", providerId);

    if (!error) {
      setMessage(`Provider ${!currentStatus ? 'verificato' : 'non verificato'} con successo!`);
      fetchAllData();
    }
  };

  const toggleContentPublication = async (contentId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("contents")
      .update({ published: !currentStatus })
      .eq("id", contentId);

    if (!error) {
      setMessage(`Contenuto ${!currentStatus ? 'pubblicato' : 'rimosso'} con successo!`);
      fetchAllData();
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div>Caricamento...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto pt-8 px-4">
        {message && (
          <Alert className="mb-4">
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Pannello Amministrativo</h1>
          <p className="text-gray-600">Gestione completa della piattaforma</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 mb-6">
          <Button 
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Panoramica
          </Button>
          <Button 
            variant={activeTab === "providers" ? "default" : "outline"}
            onClick={() => setActiveTab("providers")}
          >
            <Building className="h-4 w-4 mr-2" />
            Gestori di Attività
          </Button>
          <Button 
            variant={activeTab === "contents" ? "default" : "outline"}
            onClick={() => setActiveTab("contents")}
          >
            <FileText className="h-4 w-4 mr-2" />
            Contenuti
          </Button>
          <Button 
            variant={activeTab === "users" ? "default" : "outline"}
            onClick={() => setActiveTab("users")}
          >
            <Users className="h-4 w-4 mr-2" />
            Utenti
          </Button>
          <Button 
            variant={activeTab === "texts" ? "default" : "outline"}
            onClick={() => setActiveTab("texts")}
          >
            <Type className="h-4 w-4 mr-2" />
            Testi
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-gray-600">Utenti Totali</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{providers.length}</div>
                <p className="text-gray-600">Gestori di Attività</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">{contents.length}</div>
                <p className="text-gray-600">Contenuti Totali</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold">
                  {providers.filter(p => p.verified).length}
                </div>
                <p className="text-gray-600">Gestori Verificati</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === "providers" && (
          <Card>
            <CardHeader>
              <CardTitle>Gestori di Attività</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers.map((provider) => (
                  <div key={provider.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">{provider.business_name}</h3>
                      <p className="text-gray-600 text-sm">{provider.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{provider.city}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          provider.verified ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {provider.verified ? 'Verificato' : 'Non Verificato'}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant={provider.verified ? "outline" : "default"}
                      onClick={() => toggleProviderVerification(provider.id, provider.verified || false)}
                    >
                      {provider.verified ? 'Rimuovi Verifica' : 'Verifica'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Contents Tab */}
        {activeTab === "contents" && (
          <Card>
            <CardHeader>
              <CardTitle>Contenuti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contents.map((content) => (
                  <div key={content.id} className="flex justify-between items-center p-4 border rounded-lg">
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
                    <Button
                      variant={content.published ? "outline" : "default"}
                      onClick={() => toggleContentPublication(content.id, content.published || false)}
                    >
                      {content.published ? 'Nascondi' : 'Pubblica'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <Card>
            <CardHeader>
              <CardTitle>Utenti</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h3 className="font-semibold">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-gray-600 text-sm">{user.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{user.city}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          user.role === 'admin' ? 'bg-red-100 text-red-800' :
                          user.role === 'provider' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role === 'admin' ? 'Amministratore' :
                           user.role === 'provider' ? 'Gestore di Attività' : 'Genitore'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Texts Management Tab */}
        {activeTab === "texts" && <TextsManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
