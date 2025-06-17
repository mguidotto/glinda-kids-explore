
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type AgeGroup = Database["public"]["Enums"]["age_group"];
type ContentType = Database["public"]["Enums"]["content_type"];
type Modality = Database["public"]["Enums"]["modality"];

export const DemoDataSeeder = () => {
  useEffect(() => {
    const seedData = async () => {
      console.log("🌱 Starting demo data seeding...");
      
      try {
        // Seed categories
        console.log("Creating categories...");
        const categories = [
          { name: "Asili Nido", slug: "asili-nido", description: "Servizi di assistenza per bambini 0-3 anni", icon: "baby", color: "#FF6B7A" },
          { name: "Corsi di Nuoto", slug: "corsi-nuoto", description: "Lezioni di nuoto per tutte le età", icon: "waves", color: "#7BB3BD" },
          { name: "Campi Estivi", slug: "campi-estivi", description: "Attività estive educative e ricreative", icon: "sun", color: "#F4D03F" },
          { name: "Corsi di Musica", slug: "corsi-musica", description: "Educazione musicale per bambini", icon: "music", color: "#8B4A6B" },
          { name: "Sport per Bambini", slug: "sport-bambini", description: "Attività sportive adatte ai più piccoli", icon: "dumbbell", color: "#FF6B35" },
          { name: "Laboratori Creativi", slug: "laboratori-creativi", description: "Attività artistiche e manuali", icon: "palette", color: "#9B59B6" }
        ];

        const { data: existingCategories } = await supabase
          .from('categories')
          .select('slug');
        
        const existingSlugs = existingCategories?.map(c => c.slug) || [];
        
        for (const category of categories) {
          if (!existingSlugs.includes(category.slug)) {
            const { error } = await supabase
              .from('categories')
              .insert([category]);
            
            if (error) {
              console.error('Error creating category:', category.slug, error);
            } else {
              console.log('✅ Created category:', category.name);
            }
          }
        }

        // Get category IDs
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('id, slug');

        if (!categoriesData) {
          console.error("No categories found!");
          return;
        }

        // Seed providers
        console.log("Creating providers...");
        const providers = [
          {
            business_name: "Nido dell'Infanzia Arcobaleno",
            description: "Asilo nido specializzato nell'accoglienza di bambini da 6 mesi a 3 anni",
            email: "info@nidoarcobaleno.it",
            phone: "02-1234567",
            website: "https://nidoarcobaleno.it",
            address: "Via Milano 15",
            city: "Milano",
            verified: true
          },
          {
            business_name: "Piscina Comunale Blu",
            description: "Centro natatorio con corsi per bambini e adulti",
            email: "corsi@piscinablu.it",
            phone: "06-7654321",
            website: "https://piscinablu.it",
            address: "Viale Roma 42",
            city: "Roma",
            verified: true
          },
          {
            business_name: "Campo Estivo Natura",
            description: "Campi estivi all'aria aperta con attività educative",
            email: "info@camponatura.it",
            phone: "055-9876543",
            address: "Via Firenze 8",
            city: "Firenze",
            verified: true
          },
          {
            business_name: "Scuola di Musica Armonia",
            description: "Corsi di musica per bambini dai 3 anni in su",
            email: "info@musicaarmonia.it",
            phone: "011-5555555",
            address: "Corso Torino 23",
            city: "Torino",
            verified: true
          }
        ];

        const { data: existingProviders } = await supabase
          .from('providers')
          .select('business_name');
        
        const existingBusinessNames = existingProviders?.map(p => p.business_name) || [];
        
        for (const provider of providers) {
          if (!existingBusinessNames.includes(provider.business_name)) {
            const { error } = await supabase
              .from('providers')
              .insert([provider]);
            
            if (error) {
              console.error('Error creating provider:', provider.business_name, error);
            } else {
              console.log('✅ Created provider:', provider.business_name);
            }
          }
        }

        // Get provider IDs
        const { data: providersData } = await supabase
          .from('providers')
          .select('id, business_name');

        if (!providersData) {
          console.error("No providers found!");
          return;
        }

        // Seed contents
        console.log("Creating contents...");
        const contents = [
          {
            title: "Nido Tempo Pieno",
            description: "Servizio di asilo nido a tempo pieno per bambini da 6 mesi a 3 anni. Include pasti, attività educative e assistenza qualificata.",
            provider_id: providersData.find(p => p.business_name.includes('Nido'))?.id,
            category_id: categoriesData.find(c => c.slug === 'asili-nido')?.id,
            content_type: 'servizio' as ContentType,
            age_groups: ['0-12m', '1-3a'] as AgeGroup[],
            modality: 'presenza' as Modality,
            price_from: 450,
            price_to: 650,
            duration_minutes: null,
            city: "Milano",
            address: "Via Milano 15",
            latitude: 45.4642,
            longitude: 9.1900,
            max_participants: 20,
            published: true,
            featured: true,
            images: ["/placeholder.svg"],
            booking_required: true,
            payment_type: "monthly",
            email: "info@nidoarcobaleno.it",
            phone: "02-1234567"
          },
          {
            title: "Corso di Nuoto Baby",
            description: "Corso di nuoto per neonati e bambini piccoli. Approccio dolce all'acqua con genitori.",
            provider_id: providersData.find(p => p.business_name.includes('Piscina'))?.id,
            category_id: categoriesData.find(c => c.slug === 'corsi-nuoto')?.id,
            content_type: 'corso' as ContentType,
            age_groups: ['0-12m', '1-3a'] as AgeGroup[],
            modality: 'presenza' as Modality,
            price_from: 80,
            price_to: 120,
            duration_minutes: 45,
            city: "Roma",
            address: "Viale Roma 42",
            latitude: 41.9028,
            longitude: 12.4964,
            max_participants: 8,
            published: true,
            featured: true,
            images: ["/placeholder.svg"],
            booking_required: true,
            payment_type: "course",
            email: "corsi@piscinablu.it",
            phone: "06-7654321"
          },
          {
            title: "Campo Estivo Avventura",
            description: "Campo estivo per bambini dai 6 ai 12 anni con attività all'aria aperta, sport e laboratori creativi.",
            provider_id: providersData.find(p => p.business_name.includes('Campo'))?.id,
            category_id: categoriesData.find(c => c.slug === 'campi-estivi')?.id,
            content_type: 'campo_estivo' as ContentType,
            age_groups: ['6-10a'] as AgeGroup[],
            modality: 'presenza' as Modality,
            price_from: 200,
            price_to: 400,
            duration_minutes: 480,
            city: "Firenze",
            address: "Via Firenze 8",
            latitude: 43.7696,
            longitude: 11.2558,
            max_participants: 30,
            published: true,
            featured: true,
            images: ["/placeholder.svg"],
            booking_required: true,
            payment_type: "weekly",
            email: "info@camponatura.it",
            phone: "055-9876543"
          },
          {
            title: "Corso di Pianoforte per Bambini",
            description: "Lezioni di pianoforte individuali per bambini dai 4 anni. Metodo Suzuki e approccio ludico.",
            provider_id: providersData.find(p => p.business_name.includes('Musica'))?.id,
            category_id: categoriesData.find(c => c.slug === 'corsi-musica')?.id,
            content_type: 'corso' as ContentType,
            age_groups: ['3-6a', '6-10a'] as AgeGroup[],
            modality: 'presenza' as Modality,
            price_from: 60,
            price_to: 100,
            duration_minutes: 30,
            city: "Torino",
            address: "Corso Torino 23",
            latitude: 45.0703,
            longitude: 7.6869,
            max_participants: 1,
            published: true,
            featured: true,
            images: ["/placeholder.svg"],
            booking_required: true,
            payment_type: "lesson",
            email: "info@musicaarmonia.it",
            phone: "011-5555555"
          },
          {
            title: "Calcetto per Piccoli",
            description: "Corso di calcio per bambini dai 5 agli 8 anni. Focus su divertimento e sviluppo delle abilità motorie.",
            provider_id: providersData[0]?.id,
            category_id: categoriesData.find(c => c.slug === 'sport-bambini')?.id,
            content_type: 'corso' as ContentType,
            age_groups: ['3-6a', '6-10a'] as AgeGroup[],
            modality: 'presenza' as Modality,
            price_from: 40,
            price_to: 80,
            duration_minutes: 60,
            city: "Milano",
            address: "Centro Sportivo Milano",
            latitude: 45.4642,
            longitude: 9.1900,
            max_participants: 15,
            published: true,
            featured: false,
            images: ["/placeholder.svg"],
            booking_required: true,
            payment_type: "monthly",
            email: "sport@milano.it",
            phone: "02-1111111"
          },
          {
            title: "Laboratorio di Pittura Creativa",
            description: "Laboratori di arte e pittura per bambini. Espressione creativa e sviluppo della fantasia.",
            provider_id: providersData[1]?.id,
            category_id: categoriesData.find(c => c.slug === 'laboratori-creativi')?.id,
            content_type: 'corso' as ContentType,
            age_groups: ['3-6a', '6-10a'] as AgeGroup[],
            modality: 'presenza' as Modality,
            price_from: 25,
            price_to: 50,
            duration_minutes: 90,
            city: "Roma",
            address: "Via dell'Arte 10",
            latitude: 41.9028,
            longitude: 12.4964,
            max_participants: 12,
            published: true,
            featured: false,
            images: ["/placeholder.svg"],
            booking_required: true,
            payment_type: "session",
            email: "arte@roma.it",
            phone: "06-2222222"
          }
        ];

        const { data: existingContents } = await supabase
          .from('contents')
          .select('title');
        
        const existingTitles = existingContents?.map(c => c.title) || [];
        
        for (const content of contents) {
          if (content.provider_id && content.category_id && !existingTitles.includes(content.title)) {
            const { error } = await supabase
              .from('contents')
              .insert([content]);
            
            if (error) {
              console.error('Error creating content:', content.title, error);
            } else {
              console.log('✅ Created content:', content.title);
            }
          }
        }

        console.log("🎉 Demo data seeding completed!");

      } catch (error) {
        console.error("❌ Error seeding demo data:", error);
      }
    };

    // Sempre esegui il seeding
    seedData();
  }, []);

  return null;
};
