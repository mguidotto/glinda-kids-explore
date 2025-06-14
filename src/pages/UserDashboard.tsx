
import { useState } from "react";
import { Heart, Clock, Star, Calendar, Settings, User, Bell, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("bookings");

  // Mock user data
  const user = {
    name: "Maria Rossi",
    email: "maria.rossi@email.com",
    avatar: "/placeholder.svg",
    memberSince: "2023-03-15",
    totalBookings: 12,
    totalReviews: 8,
    averageRating: 4.6
  };

  const bookings = [
    {
      id: 1,
      title: "Corso Preparto Completo",
      provider: "Centro Nascita Serena",
      date: "2024-02-06",
      time: "18:00-20:00",
      status: "upcoming",
      price: 180,
      location: "Milano Centro"
    },
    {
      id: 2,
      title: "Spettacolo Il Piccolo Principe",
      provider: "Teatro dell'Opera dei Burattini",
      date: "2024-01-20",
      time: "15:00-16:30",
      status: "completed",
      price: 15,
      location: "Roma"
    },
    {
      id: 3,
      title: "Campus Estivo Natura",
      provider: "Avventura Verde",
      date: "2024-06-15",
      time: "08:00-17:00",
      status: "upcoming",
      price: 280,
      location: "Parco delle Madonie"
    }
  ];

  const favorites = [
    {
      id: 1,
      title: "Corso di Nuoto per Bambini",
      provider: "Piscina Comunale",
      category: "Sport",
      rating: 4.7,
      price: 120
    },
    {
      id: 2,
      title: "Laboratorio Creativo",
      provider: "Atelier dei Piccoli",
      category: "Arte",
      rating: 4.9,
      price: 45
    },
    {
      id: 3,
      title: "Corso di Inglese Giocoso",
      provider: "English for Kids",
      category: "Lingue",
      rating: 4.8,
      price: 80
    }
  ];

  const reviews = [
    {
      id: 1,
      contentTitle: "Spettacolo Il Piccolo Principe",
      rating: 5,
      comment: "Spettacolo meraviglioso, mia figlia di 4 anni è rimasta incantata per tutto il tempo!",
      date: "2024-01-22",
      helpful: 8
    },
    {
      id: 2,
      contentTitle: "Laboratorio di Cucina per Bambini",
      rating: 4,
      comment: "Attività molto coinvolgente, i bambini si sono divertiti molto. Organizzazione ottima.",
      date: "2024-01-10",
      helpful: 12
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'Prossimo';
      case 'completed': return 'Completato';
      case 'cancelled': return 'Annullato';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-lg">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{user.name}</h1>
              <p className="text-gray-600 mb-2">{user.email}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>Membro dal {new Date(user.memberSince).toLocaleDateString('it-IT')}</span>
                <span>•</span>
                <span>{user.totalBookings} prenotazioni</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                  <span>{user.averageRating} media recensioni</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Prenotazioni
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Preferiti
            </TabsTrigger>
            <TabsTrigger value="reviews" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Recensioni
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Impostazioni
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              {bookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{booking.title}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusText(booking.status)}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2">{booking.provider}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(booking.date).toLocaleDateString('it-IT')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {booking.time}
                          </span>
                          <span>{booking.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-green-600">€{booking.price}</span>
                          <div className="flex gap-2">
                            {booking.status === 'upcoming' && (
                              <Button variant="outline" size="sm">
                                Modifica
                              </Button>
                            )}
                            {booking.status === 'completed' && (
                              <Button variant="outline" size="sm">
                                Lascia Recensione
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              Dettagli
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{favorite.title}</CardTitle>
                    <p className="text-gray-600">{favorite.provider}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">{favorite.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="font-medium">{favorite.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-green-600">€{favorite.price}</span>
                      <Button size="sm">Prenota</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{review.contentTitle}</h3>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{new Date(review.date).toLocaleDateString('it-IT')}</span>
                      <span>{review.helpful} persone hanno trovato utile questa recensione</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Informazioni Personali
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nome</label>
                    <input 
                      type="text" 
                      defaultValue={user.name}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      defaultValue={user.email}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <Button>Salva Modifiche</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifiche
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Email per nuove prenotazioni</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Promemoria eventi</span>
                    <input type="checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Newsletter settimanale</span>
                    <input type="checkbox" />
                  </div>
                  <Button>Aggiorna Preferenze</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;
