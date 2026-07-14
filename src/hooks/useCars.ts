import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import type { Car } from "@/types";

export function useCars() {
  const userId = useAuthStore((s) => s.session?.user.id);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) {
      setCars([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("cars")
      .select("*")
      .eq("user_id", userId)
      .order("is_primary", { ascending: false })
      .order("created_at", { ascending: true });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setError(null);
      setCars((data ?? []) as Car[]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addCar = useCallback(
    async (car: Omit<Car, "id" | "user_id" | "created_at">) => {
      if (!userId) return { error: "Не авторизован" };
      const makePrimary = cars.length === 0 ? true : car.is_primary;
      const { error: insertError } = await supabase
        .from("cars")
        .insert({ ...car, is_primary: makePrimary, user_id: userId });
      if (insertError) return { error: insertError.message };
      await refetch();
      return { error: null };
    },
    [userId, cars.length, refetch]
  );

  const removeCar = useCallback(
    async (id: string) => {
      const { error: deleteError } = await supabase.from("cars").delete().eq("id", id);
      if (deleteError) return { error: deleteError.message };
      await refetch();
      return { error: null };
    },
    [refetch]
  );

  return { cars, loading, error, refetch, addCar, removeCar };
}
