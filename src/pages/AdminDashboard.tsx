
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import UsersManagement from "@/components/admin/UsersManagement";
import CategoriesManagement from "@/components/admin/CategoriesManagement";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
import TextsManagement from "@/components/admin/TextsManagement";
import BrandingManagement from "@/components/admin/BrandingManagement";
import SocialMetaManagement from "@/components/admin/SocialMetaManagement";
import AppIconsManagement from "@/components/admin/AppIconsManagement";
import ContentsManagement from "@/components/admin/ContentsManagement";
import PagesManagement from "@/components/admin/PagesManagement";
import TagsManagement from "@/components/admin/TagsManagement";
import GoogleAnalyticsManagement from "@/components/admin/GoogleAnalyticsManagement";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    console.log("AdminDashboard render - Loading:", loading, "User:", user?.email, "Profile role:", profile?.role);
  }, [loading, user, profile]);

  if (loading) {
    console.log("Showing loading state");
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div>Caricamento...</div>
        </div>
      </div>
    );
  }

  if (!user || !profile || profile.role !== 'admin') {
    console.log("Access denied - User:", !!user, "Profile:", !!profile, "Role:", profile?.role);
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Accesso non autorizzato</h2>
            <p className="text-gray-600">Solo gli amministratori possono accedere a questa sezione.</p>
          </div>
        </div>
      </div>
    );
  }

  console.log("Rendering admin dashboard for:", user.email);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Amministratore</h1>
          <p className="text-gray-600 mt-2">Gestisci tutti gli aspetti della piattaforma</p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          {/* Responsive TabsList */}
          <div className="w-full overflow-x-auto">
            <TabsList className="grid w-full grid-cols-5 md:grid-cols-11 min-w-max md:min-w-0">
              <TabsTrigger value="users" className="text-xs md:text-sm">Utenti</TabsTrigger>
              <TabsTrigger value="contents" className="text-xs md:text-sm">Contenuti</TabsTrigger>
              <TabsTrigger value="categories" className="text-xs md:text-sm">Categorie</TabsTrigger>
              <TabsTrigger value="tags" className="text-xs md:text-sm">Tag</TabsTrigger>
              <TabsTrigger value="reviews" className="text-xs md:text-sm">Recensioni</TabsTrigger>
              <TabsTrigger value="texts" className="text-xs md:text-sm hidden md:inline-flex">Testi</TabsTrigger>
              <TabsTrigger value="branding" className="text-xs md:text-sm hidden md:inline-flex">Branding</TabsTrigger>
              <TabsTrigger value="social" className="text-xs md:text-sm hidden md:inline-flex">Social</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs md:text-sm hidden md:inline-flex">Analytics</TabsTrigger>
              <TabsTrigger value="icons" className="text-xs md:text-sm hidden md:inline-flex">Icone</TabsTrigger>
              <TabsTrigger value="pages" className="text-xs md:text-sm hidden md:inline-flex">Pagine</TabsTrigger>
            </TabsList>
          </div>

          {/* Mobile dropdown for hidden tabs */}
          <div className="md:hidden">
            <select 
              className="w-full p-2 border rounded-lg bg-white"
              onChange={(e) => {
                const tab = document.querySelector(`[data-value="${e.target.value}"]`) as HTMLElement;
                tab?.click();
              }}
            >
              <option value="">Altri strumenti...</option>
              <option value="texts">Testi</option>
              <option value="branding">Branding</option>
              <option value="social">Social</option>
              <option value="analytics">Analytics</option>
              <option value="icons">Icone</option>
              <option value="pages">Pagine</option>
            </select>
          </div>

          <TabsContent value="users" className="space-y-6">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="contents" className="space-y-6">
            <ContentsManagement />
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <CategoriesManagement />
          </TabsContent>

          <TabsContent value="tags" className="space-y-6">
            <TagsManagement />
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

          <TabsContent value="social" className="space-y-6">
            <SocialMetaManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <GoogleAnalyticsManagement />
          </TabsContent>

          <TabsContent value="icons" className="space-y-6">
            <AppIconsManagement />
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
