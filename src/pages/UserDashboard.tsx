
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Star, Heart } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      try {
        // Fetch user profile
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        setProfile(profileData);

        // Fetch user bookings
        const { data: bookingsData } = await supabase
          .from("bookings")
          .select(`
            *,
            contents!inner(
              id,
              title,
              description,
              city,
              images,
              price_from,
              categories!inner(name)
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setBookings(bookingsData || []);

        // Fetch user favorites
        const { data: favoritesData } = await supabase
          .from("favorites")
          .select(`
            *,
            contents!inner(
              id,
              title,
              description,
              city,
              images,
              price_from,
              categories!inner(name)
            )
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setFavorites(favoritesData || []);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>Caricamento...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* User Profile Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ciao, {profile?.first_name || user?.email}!
          </h1>
          <p className="text-gray-600">
            Membro da {profile?.created_at ? formatDate(profile.created_at) : 'oggi'}
          </p>
          {profile?.email && (
            <p className="text-sm text-gray-500">
              {profile.email}
            </p>
          )}
        </div>

        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#8B4A6B] mb-2">{bookings.length}</div>
              <div className="text-gray-600">Prenotazioni</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#7BB3BD] mb-2">{favorites.length}</div>
              <div className="text-gray-600">Preferiti</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-[#F4D03F] mb-2">
                {bookings.filter(b => b.status === 'confirmed').length}
              </div>
              <div className="text-gray-600">Confermate</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Le mie prenotazioni</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/search">Prenota altro</Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.slice(0, 5).map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <img 
                          src={booking.contents.images?.[0] || "/placeholder.svg"} 
                          alt={booking.contents.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{booking.contents.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>{booking.contents.city}</span>
                            <Badge variant="secondary" className="text-xs">
                              {booking.contents.categories.name}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              {booking.booking_date && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(booking.booking_date)}
                                </div>
                              )}
                            </div>
                            <Badge 
                              className={
                                booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Non hai ancora prenotazioni</p>
                    <Button className="mt-4" asChild>
                      <Link to="/search">Scopri le attività</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Favorites */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">I miei preferiti</h2>
              <Button variant="outline" size="sm" asChild>
                <Link to="/search">Scopri altro</Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {favorites.length > 0 ? (
                favorites.slice(0, 5).map((favorite) => (
                  <Card key={favorite.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <img 
                          src={favorite.contents.images?.[0] || "/placeholder.svg"} 
                          alt={favorite.contents.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{favorite.contents.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <MapPin className="h-3 w-3" />
                            <span>{favorite.contents.city}</span>
                            <Badge variant="secondary" className="text-xs">
                              {favorite.contents.categories.name}
                            </Badge>
                          </div>
                          {favorite.contents.price_from && (
                            <div className="text-sm font-medium text-[#8B4A6B]">
                              Da €{favorite.contents.price_from}
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/content/${favorite.contents.id}`}>
                            Vedi
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Non hai ancora preferiti</p>
                    <Button className="mt-4" asChild>
                      <Link to="/search">Esplora le attività</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;
