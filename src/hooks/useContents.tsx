
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Content = Database["public"]["Tables"]["contents"]["Row"];
type Category = Database["public"]["Tables"]["categories"]["Row"];

export const useContents = () => {
  const [contents, setContents] = useState<Content[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContents = async (filters?: {
    category?: string;
    search?: string;
    city?: string;
  }) => {
    setLoading(true);
    
    let query = supabase
      .from("contents")
      .select(`
        *,
        providers!inner(business_name, verified),
        categories(name, slug)
      `)
      .eq("published", true);

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
    
    setLoading(false);
  };

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
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
