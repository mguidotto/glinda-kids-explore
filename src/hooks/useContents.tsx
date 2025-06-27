
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Content = Database["public"]["Tables"]["contents"]["Row"] & {
  providers?: { business_name: string; verified: boolean };
  categories?: { name: string; slug: string };
  distance_km?: number;
};
type Category = Database["public"]["Tables"]["categories"]["Row"];

export const useContents = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContents = async (filters?: {
    category?: string;
    search?: string;
    city?: string;
    latitude?: number;
    longitude?: number;
    radius?: number;
  }) => {
    setLoading(true);
    
    try {
      // If geolocation is provided, use the spatial search function
      if (filters?.latitude && filters?.longitude) {
        const { data, error } = await supabase.rpc('get_contents_within_radius', {
          center_lat: filters.latitude,
          center_lon: filters.longitude,
          radius_km: filters.radius || 50
        });

        if (!error && data) {
          // Get full content details for the nearby contents
          const contentIds = data.map(item => item.id);
          
          let query = supabase
            .from("contents")
            .select(`
              *,
              providers!inner(business_name, verified),
              categories!inner(name, slug, active)
            `)
            .in('id', contentIds)
            .eq("published", true)
            .eq("categories.active", true);

          if (filters?.category && filters.category !== "all") {
            query = query.eq("categories.slug", filters.category);
          }

          if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
          }

          const { data: contentsData } = await query;
          
          if (contentsData) {
            // Add distance information to contents
            const contentsWithDistance = contentsData.map(content => {
              const distanceInfo = data.find(d => d.id === content.id);
              return {
                ...content,
                distance_km: distanceInfo?.distance_km || null
              };
            });
            
            // Sort by distance
            contentsWithDistance.sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999));
            
            setContents(contentsWithDistance as any);
          }
        }
      } else {
        // Standard search without geolocation
        let query = supabase
          .from("contents")
          .select(`
            *,
            providers!inner(business_name, verified),
            categories!inner(name, slug, active)
          `)
          .eq("published", true)
          .eq("categories.active", true);

        if (filters?.category && filters.category !== "all") {
          query = query.eq("categories.slug", filters.category);
        }

        if (filters?.search) {
          query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        if (filters?.city) {
          query = query.ilike("city", `%${filters.city}%`);
        }

        const { data, error } = await query;
        
        if (!error && data) {
          setContents(data as any);
        }
      }
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
    
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("name");
    
    if (data) {
      setCategories(data);
    }
  };

  useEffect(() => {
    fetchContents();
    fetchCategories();
  }, []);

  return {
    contents,
    categories,
    loading,
    fetchContents,
    fetchCategories,
  };
};
