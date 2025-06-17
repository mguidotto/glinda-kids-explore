
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const DemoDataSeeder = () => {
  const { profile } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);

  const seedDemoData = async () => {
    if (profile?.role !== 'admin') return;
    
    setIsSeeding(true);
    
    try {
      // Seed categories
      const categories = [
        { name: "Corsi di Nuoto", slug: "nuoto", description: "Corsi e lezioni di nuoto per bambini", icon: "🏊‍♀️", color: "#3B82F6" },
        { name: "Danza e Ballo", slug: "danza", description: "Corsi di danza, ballo e movimento", icon: "💃", color: "#EC4899" },
        { name: "Sport di Squadra", slug: "sport", description: "Calcio, basket, pallavolo e altri sport", icon: "⚽", color: "#10B981" },
        { name: "Arte e Creatività", slug: "arte", description: "Pittura, disegno, laboratori creativi", icon: "🎨", color: "#F59E0B" },
        { name: "Musica", slug: "musica", description: "Strumenti musicali, canto, musica d'insieme", icon: "🎵", color: "#8B5CF6" },
        { name: "Teatro", slug: "teatro", description: "Recitazione, improvvisazione, spettacoli", icon: "🎭", color: "#EF4444" }
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

      // Create demo provider
      const { data: provider } = await supabase
        .from("providers")
        .upsert({
          id: "demo-provider-1",
          business_name: "Centro Sportivo Olimpia",
          description: "Centro sportivo moderno con piscina, palestre e spazi all'aperto",
          email: "info@olimpia.it",
          phone: "+39 02 9876 5432",
          website: "https://www.olimpia.it",
          address: "Via dello Sport 15",
          city: "Milano",
          verified: true,
          user_id: profile.id
        }, { onConflict: "id" })
        .select()
        .single();

      if (provider && createdCategories) {
        // Seed demo contents
        const contents = [
          {
            title: "Corso di Nuoto per Principianti",
            description: "Corso di nuoto dedicato ai bambini che si avvicinano per la prima volta all'acqua. Istruttori qualificati e ambiente sicuro.",
            provider_id: provider.id,
            category_id: createdCategories.find(c => c.slug === "nuoto")?.id,
            content_type: "corso",
            age_groups: ["3-5", "6-8"],
            modality: "presenza",
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
            provider_id: provider.id,
            category_id: createdCategories.find(c => c.slug === "danza")?.id,
            content_type: "corso",
            age_groups: ["6-8", "9-10"],
            modality: "presenza",
            price_from: 60,
            price_to: 90,
            duration_minutes: 60,
            city: "Milano",
            latitude: 45.4642,
            longitude: 9.1900,
            max_participants: 12,
            published: true,
            images: ["https://images.unsplash.com/photo-1547153760-18fc86324498?w=800"],
            email: "danza@olimpia.it",
            phone: "+39 02 9876 5432"
          },
          {
            title: "Laboratorio di Pittura Creativa",
            description: "Laboratorio artistico dove i bambini possono esprimere la loro creatività attraverso colori, forme e tecniche diverse.",
            provider_id: provider.id,
            category_id: createdCategories.find(c => c.slug === "arte")?.id,
            content_type: "laboratorio",
            age_groups: ["3-5", "6-8", "9-10"],
            modality: "presenza",
            price_from: 35,
            price_to: 50,
            duration_minutes: 90,
            city: "Milano",
            latitude: 45.4642,
            longitude: 9.1900,
            max_participants: 10,
            published: true,
            images: ["https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800"],
            email: "arte@olimpia.it",
            phone: "+39 02 9876 5432"
          }
        ];

        for (const content of contents) {
          await supabase.from("contents").upsert(content);
        }
      }

      console.log("Demo data seeded successfully!");
    } catch (error) {
      console.error("Error seeding demo data:", error);
    } finally {
      setIsSeeding(false);
    }
  };

  useEffect(() => {
    if (profile?.role === 'admin') {
      seedDemoData();
    }
  }, [profile]);

  if (isSeeding) {
    return <div className="text-sm text-gray-500">Caricamento dati demo...</div>;
  }

  return null;
};
