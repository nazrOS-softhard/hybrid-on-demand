import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Tariff } from "@/types";

const FALLBACK_TARIFFS: Tariff[] = [
  {
    id: "fallback-fast",
    name: "Быстрая зарядка",
    description: "До 80%",
    price: 1900,
    target_percent: 80,
    is_night: false,
    sort_order: 1,
  },
  {
    id: "fallback-standard",
    name: "Стандартная зарядка",
    description: "До 100%",
    price: 2400,
    target_percent: 100,
    is_night: false,
    sort_order: 2,
  },
  {
    id: "fallback-night",
    name: "Ночная зарядка",
    description: "С 00:00 до 06:00",
    price: 1600,
    target_percent: 100,
    is_night: true,
    sort_order: 3,
  },
];

export function useTariffs() {
  const [tariffs, setTariffs] = useState<Tariff[]>(FALLBACK_TARIFFS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const { data, error } = await supabase.from("tariffs").select("*").order("sort_order");
      if (mounted && !error && data && data.length > 0) {
        setTariffs(data as Tariff[]);
      }
      if (mounted) setLoading(false);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { tariffs, loading };
}
