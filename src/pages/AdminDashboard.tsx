
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import ContentSEOManagement from "@/components/admin/ContentSEOManagement";
import FaviconManagement from "@/components/admin/FaviconManagement";
import { useAuth } from "@/hooks/useAuth";

const AdminDashboard = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    console.log("AdminDashboard render - Loading:", loading, "User:", user?.email, "Profile role:", profile?.role);
  }, [loading, user, profile]);

  if (loading) {
    console.log("Showing loading state");
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Caricamento...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !profile || profile.role !== 'admin') {
    console.log("Access denied - User:", !!user, "Profile:", !!profile, "Role:", profile?.role);
    return (
      <div className="min-h-screen bg-gray-50">
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

  const allTabs = [
    { id: "users", label: "Utenti", component: <UsersManagement /> },
    { id: "contents", label: "Contenuti", component: <ContentsManagement /> },
    { id: "categories", label: "Categorie", component: <CategoriesManagement /> },
    { id: "tags", label: "Tag", component: <TagsManagement /> },
    { id: "reviews", label: "Recensioni", component: <ReviewsManagement /> },
    { id: "texts", label: "Testi", component: <TextsManagement /> },
    { id: "branding", label: "Branding", component: <BrandingManagement /> },
    { id: "social", label: "Social", component: <SocialMetaManagement /> },
    { id: "content-seo", label: "SEO", component: <ContentSEOManagement /> },
    { id: "analytics", label: "Analytics", component: <GoogleAnalyticsManagement /> },
    { id: "icons", label: "Icone", component: <AppIconsManagement /> },
    { id: "favicon", label: "Favicon", component: <FaviconManagement /> },
    { id: "pages", label: "Pagine", component: <PagesManagement /> },
  ];

  // Organize tabs into logical groups for better desktop layout
  const contentTabs = allTabs.slice(0, 5); // Users, Contents, Categories, Tags, Reviews
  const customizationTabs = allTabs.slice(5, 10); // Texts, Branding, Social, SEO, Analytics
  const assetTabs = allTabs.slice(10); // Icons, Favicon, Pages

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Amministratore</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Gestisci tutti gli aspetti della piattaforma</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Desktop Tabs - Organized in 3 rows for better readability */}
          <div className="hidden lg:block">
            <div className="space-y-2">
              {/* Content Management Row */}
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Gestione Contenuti</h3>
                <TabsList className="grid w-full grid-cols-5 gap-1">
                  {contentTabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="text-sm px-4 py-2">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {/* Customization Row */}
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Personalizzazione</h3>
                <TabsList className="grid w-full grid-cols-5 gap-1">
                  {customizationTabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="text-sm px-4 py-2">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              
              {/* Assets Row */}
              <div className="mb-2">
                <h3 className="text-sm font-medium text-gray-600 mb-2">Risorse</h3>
                <TabsList className="grid w-full grid-cols-3 gap-1 max-w-md">
                  {assetTabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="text-sm px-4 py-2">
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </div>
          </div>

          {/* Tablet Tabs */}
          <div className="hidden md:block lg:hidden">
            <div className="space-y-2">
              <TabsList className="grid w-full grid-cols-5 gap-1">
                {contentTabs.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="text-xs px-2 py-2">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsList className="grid w-full grid-cols-8 gap-1">
                {allTabs.slice(5).map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id} className="text-xs px-1 py-2">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </div>

          {/* Mobile Select */}
          <div className="md:hidden">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Seleziona sezione" />
              </SelectTrigger>
              <SelectContent>
                <optgroup label="Gestione Contenuti">
                  {contentTabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </optgroup>
                <optgroup label="Personalizzazione">
                  {customizationTabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </optgroup>
                <optgroup label="Risorse">
                  {assetTabs.map((tab) => (
                    <SelectItem key={tab.id} value={tab.id}>
                      {tab.label}
                    </SelectItem>
                  ))}
                </optgroup>
              </SelectContent>
            </Select>
          </div>

          {/* Tab Content */}
          {allTabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
