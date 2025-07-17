
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContentsManagement from "@/components/admin/ContentsManagement";
import CategoriesManagement from "@/components/admin/CategoriesManagement";
import ProvidersManagement from "@/components/admin/ProvidersManagement";
import UsersManagement from "@/components/admin/UsersManagement";
import ReviewsManagement from "@/components/admin/ReviewsManagement";
import BrandingManagement from "@/components/admin/BrandingManagement";
import TextsManagement from "@/components/admin/TextsManagement";
import TagsManagement from "@/components/admin/TagsManagement";
import PagesManagement from "@/components/admin/PagesManagement";
import GoogleAnalyticsManagement from "@/components/admin/GoogleAnalyticsManagement";
import SocialMetaManagement from "@/components/admin/SocialMetaManagement";
import ContentSEOManagement from "@/components/admin/ContentSEOManagement";
import SitemapManagement from "@/components/admin/SitemapManagement";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("contents");

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard Amministratore</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-12">
          <TabsTrigger value="contents">Contenuti</TabsTrigger>
          <TabsTrigger value="categories">Categorie</TabsTrigger>
          <TabsTrigger value="providers">Provider</TabsTrigger>
          <TabsTrigger value="users">Utenti</TabsTrigger>
          <TabsTrigger value="reviews">Recensioni</TabsTrigger>
          <TabsTrigger value="tags">Tag</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="texts">Testi</TabsTrigger>
          <TabsTrigger value="pages">Pagine</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="sitemap">Sitemap</TabsTrigger>
        </TabsList>

        <TabsContent value="contents">
          <ContentsManagement />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesManagement />
        </TabsContent>

        <TabsContent value="providers">
          <ProvidersManagement />
        </TabsContent>

        <TabsContent value="users">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsManagement />
        </TabsContent>

        <TabsContent value="tags">
          <TagsManagement />
        </TabsContent>

        <TabsContent value="branding">
          <BrandingManagement />
        </TabsContent>

        <TabsContent value="texts">
          <TextsManagement />
        </TabsContent>

        <TabsContent value="pages">
          <PagesManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <GoogleAnalyticsManagement />
        </TabsContent>

        <TabsContent value="seo">
          <div className="space-y-6">
            <SocialMetaManagement />
            <ContentSEOManagement />
          </div>
        </TabsContent>

        <TabsContent value="sitemap">
          <SitemapManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
