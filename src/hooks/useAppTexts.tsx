
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type AppText = Database["public"]["Tables"]["app_texts"]["Row"];

export const useAppTexts = () => {
  const [texts, setTexts] = useState<AppText[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTexts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("app_texts")
      .select("*")
      .order("category", { ascending: true })
      .order("key", { ascending: true });

    if (!error && data) {
      setTexts(data);
    }
    setLoading(false);
  };

  const updateText = async (key: string, value: string) => {
    const { error } = await supabase.rpc('update_app_text', {
      text_key: key,
      new_value: value
    });

    if (!error) {
      await fetchTexts();
    }
    return { error };
  };

  const getText = (key: string, defaultValue: string = '') => {
    const text = texts.find(t => t.key === key);
    return text?.value || defaultValue;
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  return {
    texts,
    loading,
    fetchTexts,
    updateText,
    getText,
  };
};
