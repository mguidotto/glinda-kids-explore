import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, User, MapPin } from "lucide-react";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";

const UserDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>Caricamento...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>Accesso non autorizzato</div>
        </div>
      </div>
    );
  }

  const { data: favorites } = useQuery({
    queryKey: ["favorites", user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select(`
          *,
          contents (
            id,
            title,
            description,
            city,
            featured_image
          )
        `)
        .eq("user_id", user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">La Mia Dashboard</h1>
          <p className="text-gray-600 mt-2">Gestisci i tuoi contenuti preferiti e le tue attività</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Favorites Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Preferiti</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{favorites?.length || 0}</div>
              <p className="text-xs text-muted-foreground">
                Attività salvate
              </p>
            </CardContent>
          </Card>

          {/* Profile Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Profilo</CardTitle>
              <User className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Attivo</div>
              <p className="text-xs text-muted-foreground">
                Il tuo profilo è completo
              </p>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posizione</CardTitle>
              <MapPin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Italia</div>
              <p className="text-xs text-muted-foreground">
                La tua area di ricerca
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Favorites List */}
        {favorites && favorites.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">I Tuoi Preferiti</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite: any) => (
                <Card key={favorite.id}>
                  <CardContent className="p-4">
                    {favorite.contents?.featured_image && (
                      <img 
                        src={favorite.contents.featured_image} 
                        alt={favorite.contents.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="font-semibold text-lg mb-2">{favorite.contents?.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{favorite.contents?.description}</p>
                    {favorite.contents?.city && (
                      <p className="text-gray-500 text-sm flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {favorite.contents.city}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
