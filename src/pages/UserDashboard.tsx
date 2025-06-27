
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Heart, User, Mail, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      setProfile(profileData);

      // Fetch user bookings
      const { data: bookingsData } = await supabase
        .from('bookings')
        .select(`
          *,
          contents (
            id,
            title,
            description,
            city,
            featured_image,
            images,
            categories (name)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      setBookings(bookingsData || []);

      // Fetch user favorites
      const { data: favoritesData } = await supabase
        .from('favorites')
        .select(`
          *,
          contents (
            id,
            title,
            description,
            city,
            featured_image,
            images,
            categories (name)
          )
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      setFavorites(favoritesData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>Caricamento...</div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#8B4A6B] to-[#7BB3BD] rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}`
                        : user?.email?.split('@')[0] || 'Utente'
                      }
                    </h2>
                    <p className="text-gray-600 text-sm">{profile?.role || 'Genitore'}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                {profile?.city && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.city}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Iscritto dal {formatDate(profile?.created_at || user?.created_at || '')}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Le tue statistiche</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Prenotazioni</span>
                  <Badge variant="secondary">{bookings.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Preferiti</span>
                  <Badge variant="secondary">{favorites.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Le tue prenotazioni
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                        <img 
                          src={booking.contents?.featured_image || booking.contents?.images?.[0] || "/placeholder.svg"} 
                          alt={booking.contents?.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{booking.contents?.title}</h3>
                          <p className="text-sm text-gray-600">{booking.contents?.city}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'pending' ? 'secondary' : 'destructive'
                            }>
                              {booking.status === 'confirmed' ? 'Confermata' :
                               booking.status === 'pending' ? 'In attesa' : 'Cancellata'}
                            </Badge>
                            {booking.booking_date && (
                              <span className="text-xs text-gray-500">
                                {formatDate(booking.booking_date)}
                              </span>
                            )}
                          </div>
                        </div>
                        <Link to={`/content/${booking.contents?.id}`}>
                          <Button variant="outline" size="sm">
                            Dettagli
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Non hai ancora prenotazioni</p>
                    <Link to="/search">
                      <Button className="mt-4">Esplora attività</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Favorites */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  I tuoi preferiti
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {favorites.map((favorite) => (
                      <div key={favorite.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex space-x-4">
                          <img 
                            src={favorite.contents?.featured_image || favorite.contents?.images?.[0] || "/placeholder.svg"} 
                            alt={favorite.contents?.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm">{favorite.contents?.title}</h3>
                            <p className="text-xs text-gray-600 mb-2">{favorite.contents?.city}</p>
                            <Link to={`/content/${favorite.contents?.id}`}>
                              <Button variant="outline" size="sm">
                                Vedi
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Non hai ancora preferiti</p>
                    <Link to="/search">
                      <Button className="mt-4">Scopri attività</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserDashboard;
