
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, UserPlus, Mail, Phone, MapPin } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

const UsersManagement = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "genitore" as const,
    phone: "",
    city: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError("Errore nel caricamento degli utenti: " + error.message);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const createUser = async () => {
    if (!newUser.email || !newUser.password) {
      setError("Email e password sono obbligatori");
      return;
    }

    setLoading(true);
    try {
      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: newUser.firstName,
            last_name: newUser.lastName,
          }
        }
      });

      if (authError) {
        setError("Errore nella creazione dell'utente: " + authError.message);
        setLoading(false);
        return;
      }

      // Update profile with additional data
      if (authData.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            role: newUser.role,
            phone: newUser.phone || null,
            city: newUser.city || null,
          })
          .eq("id", authData.user.id);

        if (profileError) {
          setError("Errore nell'aggiornamento del profilo: " + profileError.message);
        } else {
          setMessage("Utente creato con successo!");
          setIsCreateDialogOpen(false);
          setNewUser({
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            role: "genitore",
            phone: "",
            city: ""
          });
          fetchUsers();
        }
      }
    } catch (err) {
      setError("Errore imprevisto: " + (err as Error).message);
    }
    setLoading(false);
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    setLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: selectedUser.first_name,
        last_name: selectedUser.last_name,
        role: selectedUser.role,
        phone: selectedUser.phone,
        city: selectedUser.city,
      })
      .eq("id", selectedUser.id);

    if (error) {
      setError("Errore nell'aggiornamento dell'utente: " + error.message);
    } else {
      setMessage("Utente aggiornato con successo!");
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      fetchUsers();
    }
    setLoading(false);
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo utente? Questa azione non può essere annullata.")) {
      return;
    }

    setLoading(true);
    try {
      // First delete from profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (profileError) {
        setError("Errore nell'eliminazione del profilo: " + profileError.message);
        setLoading(false);
        return;
      }

      // Note: Deleting from auth.users requires admin privileges
      // This will be handled by the RLS policies and triggers
      setMessage("Utente eliminato con successo!");
      fetchUsers();
    } catch (err) {
      setError("Errore nell'eliminazione dell'utente: " + (err as Error).message);
    }
    setLoading(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800";
      case "provider":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "Amministratore";
      case "provider":
        return "Gestore di Attività";
      default:
        return "Genitore";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestione Utenti</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#8B4A6B] hover:bg-[#7A4060]">
              <UserPlus className="h-4 w-4 mr-2" />
              Crea Nuovo Utente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Crea Nuovo Utente</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="email@esempio.com"
                />
              </div>
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="Minimo 6 caratteri"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="firstName">Nome</Label>
                  <Input
                    id="firstName"
                    value={newUser.firstName}
                    onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Cognome</Label>
                  <Input
                    id="lastName"
                    value={newUser.lastName}
                    onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="role">Ruolo</Label>
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser({...newUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="genitore">Genitore</SelectItem>
                    <SelectItem value="provider">Gestore di Attività</SelectItem>
                    <SelectItem value="admin">Amministratore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={newUser.phone}
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="city">Città</Label>
                <Input
                  id="city"
                  value={newUser.city}
                  onChange={(e) => setNewUser({...newUser, city: e.target.value})}
                />
              </div>
              <Button 
                onClick={createUser} 
                disabled={loading}
                className="w-full bg-[#8B4A6B] hover:bg-[#7A4060]"
              >
                {loading ? "Creazione..." : "Crea Utente"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista Utenti ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Caricamento...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utente</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Ruolo</TableHead>
                  <TableHead>Contatti</TableHead>
                  <TableHead>Registrato</TableHead>
                  <TableHead>Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.first_name} {user.last_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {getRoleLabel(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {user.phone}
                          </div>
                        )}
                        {user.city && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {user.city}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at || '').toLocaleDateString('it-IT')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifica Utente</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="editFirstName">Nome</Label>
                  <Input
                    id="editFirstName"
                    value={selectedUser.first_name || ""}
                    onChange={(e) => setSelectedUser({...selectedUser, first_name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="editLastName">Cognome</Label>
                  <Input
                    id="editLastName"
                    value={selectedUser.last_name || ""}
                    onChange={(e) => setSelectedUser({...selectedUser, last_name: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="editRole">Ruolo</Label>
                <Select value={selectedUser.role} onValueChange={(value: any) => setSelectedUser({...selectedUser, role: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="genitore">Genitore</SelectItem>
                    <SelectItem value="provider">Gestore di Attività</SelectItem>
                    <SelectItem value="admin">Amministratore</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="editPhone">Telefono</Label>
                <Input
                  id="editPhone"
                  value={selectedUser.phone || ""}
                  onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="editCity">Città</Label>
                <Input
                  id="editCity"
                  value={selectedUser.city || ""}
                  onChange={(e) => setSelectedUser({...selectedUser, city: e.target.value})}
                />
              </div>
              <Button 
                onClick={updateUser} 
                disabled={loading}
                className="w-full bg-[#8B4A6B] hover:bg-[#7A4060]"
              >
                {loading ? "Aggiornamento..." : "Aggiorna Utente"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
