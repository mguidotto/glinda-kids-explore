
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { Database } from "@/integrations/supabase/types";

type AgeGroup = Database["public"]["Enums"]["age_group"];
type ContentType = Database["public"]["Enums"]["content_type"];
type Modality = Database["public"]["Enums"]["modality"];

export const DemoDataSeeder = () => {
  const { profile } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);
  const [hasSeeded, setHasSeeded] = useState(false);

  const seedDemoData = async () => {
    if (hasSeeded) return;
    
    setIsSeeding(true);
    
    try {
      // Check if data already exists
      const { data: existingCategories } = await supabase.from("categories").select("id").limit(1);
      if (existingCategories && existingCategories.length > 0) {
        setHasSeeded(true);
        setIsSeeding(false);
        return;
      }

      // Seed categories
      const categories = [
        { name: "Asili Nido", slug: "nidi", description: "Asili nido e servizi per la prima infanzia", icon: "🍼", color: "#3B82F6", active: true },
        { name: "Corsi di Nuoto", slug: "nuoto", description: "Corsi e lezioni di nuoto per bambini", icon: "🏊‍♀️", color: "#06B6D4", active: true },
        { name: "Danza e Ballo", slug: "danza", description: "Corsi di danza, ballo e movimento", icon: "💃", color: "#EC4899", active: true },
        { name: "Sport di Squadra", slug: "sport", description: "Calcio, basket, pallavolo e altri sport", icon: "⚽", color: "#10B981", active: true },
        { name: "Arte e Creatività", slug: "arte", description: "Pittura, disegno, laboratori creativi", icon: "🎨", color: "#F59E0B", active: true },
        { name: "Musica", slug: "musica", description: "Strumenti musicali, canto, musica d'insieme", icon: "🎵", color: "#8B5CF6", active: true },
        { name: "Teatro", slug: "teatro", description: "Recitazione, improvvisazione, spettacoli", icon: "🎭", color: "#EF4444", active: true },
        { name: "Campi Estivi", slug: "campi-estivi", description: "Campi estivi e centri ricreativi", icon: "☀️", color: "#F97316", active: true },
        { name: "Categoria Nascosta", slug: "nascosta", description: "Categoria non attiva", icon: "❌", color: "#6B7280", active: false }
      ];

      for (const cat of categories) {
        await supabase.from("categories").upsert(cat, { onConflict: "slug" });
      }

      // Get categories for content creation
      const { data: createdCategories } = await supabase.from("categories").select("*");
      
      // Seed app texts for pages
      const appTexts = [
        { key: "site.title", value: "Glinda", category: "branding" },
        { key: "about.title", value: "Chi Siamo", category: "pages" },
        { key: "about.content", value: "Siamo la piattaforma di riferimento per genitori che cercano le migliori attività per i loro bambini. Dal 2024 aiutiamo famiglie in tutta Italia a scoprire corsi, eventi e servizi educativi di qualità per bambini da 0 a 10 anni.", category: "pages" },
        { key: "contact.title", value: "Contattaci", category: "pages" },
        { key: "contact.content", value: "Hai domande o suggerimenti? Siamo qui per aiutarti! Contattaci e ti risponderemo il prima possibile.", category: "pages" },
        { key: "contact.email", value: "info@glinda.it", category: "pages" },
        { key: "contact.phone", value: "+39 02 1234 5678", category: "pages" },
        { key: "contact.address", value: "Via Roma 123, 20121 Milano (MI)", category: "pages" }
      ];

      for (const text of appTexts) {
        await supabase.from("app_texts").upsert(text, { onConflict: "key" });
      }

      // Create demo providers
      const providers = [
        {
          id: "demo-provider-1",
          business_name: "Centro Sportivo Olimpia",
          description: "Centro sportivo moderno con piscina, palestre e spazi all'aperto",
          email: "info@olimpia.it",
          phone: "+39 02 9876 5432",
          website: "https://www.olimpia.it",
          address: "Via dello Sport 15",
          city: "Milano",
          verified: true,
          user_id: profile?.id
        },
        {
          id: "demo-provider-2", 
          business_name: "Asilo Nido Il Girasole",
          description: "Asilo nido accogliente per bambini da 3 mesi a 3 anni",
          email: "info@asilonidogirasole.it",
          phone: "+39 02 1234 5678",
          website: "https://www.asilonidogirasole.it",
          address: "Via dei Bambini 10",
          city: "Roma",
          verified: true,
          user_id: profile?.id
        },
        {
          id: "demo-provider-3",
          business_name: "Accademia Danza Stelle",
          description: "Scuola di danza per bambini e ragazzi, tutti i livelli",
          email: "info@danzastelle.it", 
          phone: "+39 06 9876 5432",
          website: "https://www.danzastelle.it",
          address: "Piazza della Danza 5",
          city: "Napoli",
          verified: true,
          user_id: profile?.id
        }
      ];

      for (const provider of providers) {
        await supabase.from("providers").upsert(provider, { onConflict: "id" });
      }

      if (createdCategories) {
        // Seed demo contents with more variety
        const contents = [
          {
            title: "Asilo Nido Il Girasole - Sezione Primavera",
            description: "Asilo nido accogliente per bambini da 3 mesi a 3 anni con educatrici specializzate e ambiente sicuro.",
            provider_id: "demo-provider-2",
            category_id: createdCategories.find(c => c.slug === "nidi")?.id,
            content_type: "servizio" as ContentType,
            age_groups: ["0-12m", "1-3a"] as AgeGroup[],
            modality: "presenza" as Modality,
            price_from: 400,
            price_to: 600,
            duration_minutes: 480,
            city: "Roma",
            latitude: 41.9028,
            longitude: 12.4964,
            max_participants: 20,
            published: true,
            featured: true,
            images: ["https://images.unsplash.com/photo-1544376798-89d735c87aa2?w=800"],
            email: "info@asilonidogirasole.it",
            phone: "+39 02 1234 5678"
          },
          {
            title: "Corso di Nuoto per Principianti",
            description: "Corso di nuoto dedicato ai bambini che si avvicinano per la prima volta all'acqua. Istruttori qualificati e ambiente sicuro.",
            provider_id: "demo-provider-1",
            category_id: createdCategories.find(c => c.slug === "nuoto")?.id,
            content_type: "corso" as ContentType,
            age_groups: ["3-6a", "6-10a"] as AgeGroup[],
            modality: "presenza" as Modality,
            price_from: 80,
            price_to: 120,
            duration_minutes: 45,
            city: "Milano",
            latitude: 45.4642,
            longitude: 9.1900,
            max_participants: 8,
            published: true,
            featured: true,
            images: ["https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800"],
            email: "nuoto@olimpia.it",
            phone: "+39 02 9876 5432"
          },
          {
            title: "Danza Moderna per Bambini",
            description: "Corso di danza moderna che sviluppa creatività, coordinazione e espressività. Adatto a tutti i livelli.",
            provider_id: "demo-provider-3",
            category_id: createdCategories.find(c => c.slug === "danza")?.id,
            content_type: "corso" as ContentType,
            age_groups: ["6-10a"] as AgeGroup[],
            modality: "presenza" as Modality,
            price_from: 60,
            price_to: 90,
            duration_minutes: 60,
            city: "Napoli",
            latitude: 40.8518,
            longitude: 14.2681,
            max_participants: 12,
            published: true,
            featured: true,
            images: ["https://images.unsplash.com/photo-1547153760-18fc86324498?w=800"],
            email: "info@danzastelle.it",
            phone: "+39 06 9876 5432"
          },
          {
            title: "Laboratorio di Pittura Creativa",
            description: "Laboratorio artistico dove i bambini possono esprimere la loro creatività attraverso colori, forme e tecniche diverse.",
            provider_id: "demo-provider-1",
            category_id: createdCategories.find(c => c.slug === "arte")?.id,
            content_type: "corso" as ContentType,
            age_groups: ["3-6a", "6-10a"] as AgeGroup[],
            modality: "presenza" as Modality,
            price_from: 35,
            price_to: 50,
            duration_minutes: 90,
            city: "Milano",
            latitude: 45.4642,
            longitude: 9.1900,
            max_participants: 10,
            published: true,
            featured: true,
            images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800"],
            email: "arte@olimpia.it",
            phone: "+39 02 9876 5432"
          },
          {
            title: "Campo Estivo Avventura",
            description: "Campo estivo all'aria aperta con attività sportive, giochi e tanto divertimento per tutta l'estate.",
            provider_id: "demo-provider-1",
            category_id: createdCategories.find(c => c.slug === "campi-estivi")?.id,
            content_type: "campo_estivo" as ContentType,
            age_groups: ["6-10a"] as AgeGroup[],
            modality: "presenza" as Modality,
            price_from: 200,
            price_to: 350,
            duration_minutes: 480,
            city: "Milano",
            latitude: 45.4642,
            longitude: 9.1900,
            max_participants: 25,
            published: true,
            featured: true,
            images: ["https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800"],
            email: "estate@olimpia.it",
            phone: "+39 02 9876 5432"
          },
          {
            title: "Scuola di Calcio Little Stars",
            description: "Scuola calcio per bambini con allenatori qualificati. Impara le basi del calcio divertendoti!",
            provider_id: "demo-provider-1",
            category_id: createdCategories.find(c => c.slug === "sport")?.id,
            content_type: "corso" as ContentType,
            age_groups: ["6-10a"] as AgeGroup[],
            modality: "presenza" as Modality,
            price_from: 70,
            price_to: 100,
            duration_minutes: 90,
            city: "Milano",
            latitude: 45.4642,
            longitude: 9.1900,
            max_participants: 16,
            published: true,
            featured: true,
            images: ["https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800"],
            email: "calcio@olimpia.it",
            phone: "+39 02 9876 5432"
          }
        ];

        for (const content of contents) {
          await supabase.from("contents").upsert(content);
        }
      }

      setHasSeeded(true);
      console.log("Demo data seeded successfully!");
    } catch (error) {
      console.error("Error seeding demo data:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    // Auto-seed on first load
    seedDemoData();
  }, []);

  if (isSeeding) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
        Caricamento dati demo...
      </div>
    );
  }

  return null;
};
