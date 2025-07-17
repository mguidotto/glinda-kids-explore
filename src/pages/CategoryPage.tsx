
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/client';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import MobileLayout from '../components/MobileLayout';
import ContentCard from '../components/ContentCard';
import { useMobile } from '../hooks/use-mobile';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const isMobile = useMobile();

  const { data: category } = useQuery({
    queryKey: ['category', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: contents } = useQuery({
    queryKey: ['contents', 'category', slug],
    queryFn: async () => {
      if (!category) return [];
      
      const { data, error } = await supabase
        .from('contents')
        .select(`
          *,
          categories (name, slug),
          providers (business_name)
        `)
        .eq('category_id', category.id)
        .eq('published', true);
      
      if (error) throw error;
      return data;
    },
    enabled: !!category,
  });

  const content = (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {category && (
          <>
            <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
            {category.description && (
              <p className="text-muted-foreground mb-8">{category.description}</p>
            )}
          </>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contents?.map((content) => (
            <ContentCard key={content.id} content={content} />
          ))}
        </div>
        
        {contents?.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nessun contenuto trovato in questa categoria.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );

  if (isMobile) {
    return <MobileLayout>{content}</MobileLayout>;
  }

  return content;
};

export default CategoryPage;
