import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import type { PaymentMethod } from "@/types";

export function usePaymentMethods() {
  const userId = useAuthStore((s) => s.session?.user.id);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!userId) {
      setMethods([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    setMethods((data ?? []) as PaymentMethod[]);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const addMethod = useCallback(
    async (method: Omit<PaymentMethod, "id" | "user_id" | "created_at">) => {
      if (!userId) return { error: "Не авторизован" };
      if (method.is_default) {
        await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", userId);
      }
      const { error } = await supabase.from("payment_methods").insert({ ...method, user_id: userId });
      if (error) return { error: error.message };
      await refetch();
      return { error: null };
    },
    [userId, refetch]
  );

  const removeMethod = useCallback(
    async (id: string) => {
      const { error } = await supabase.from("payment_methods").delete().eq("id", id);
      if (error) return { error: error.message };
      await refetch();
      return { error: null };
    },
    [refetch]
  );

  const setDefault = useCallback(
    async (id: string) => {
      if (!userId) return;
      await supabase.from("payment_methods").update({ is_default: false }).eq("user_id", userId);
      await supabase.from("payment_methods").update({ is_default: true }).eq("id", id);
      await refetch();
    },
    [userId, refetch]
  );

  return { methods, loading, refetch, addMethod, removeMethod, setDefault };
}
