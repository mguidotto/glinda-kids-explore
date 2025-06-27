
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import UsersManagement from "@/components/admin/UsersManagement";
import CategoriesManagement from "@/components/admin/CategoriesManagement";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
import TextsManagement from "@/components/admin/TextsManagement";
import BrandingManagement from "@/components/admin/BrandingManagement";
import PagesManagement from "@/components/admin/PagesManagement";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const { user, loading } = useAuth();

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>Accesso non autorizzato</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Amministratore</h1>
          <p className="text-gray-600 mt-2">Gestisci tutti gli aspetti della piattaforma</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">Utenti</TabsTrigger>
            <TabsTrigger value="categories">Categorie</TabsTrigger>
            <TabsTrigger value="reviews">Recensioni</TabsTrigger>
            <TabsTrigger value="texts">Testi</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
            <TabsTrigger value="pages">Pagine</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoriesManagement />
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <ReviewsManagement />
          </TabsContent>

          <TabsContent value="texts" className="space-y-6">
            <TextsManagement />
          </TabsContent>

          <TabsContent value="branding" className="space-y-6">
            <BrandingManagement />
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <PagesManagement />
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
