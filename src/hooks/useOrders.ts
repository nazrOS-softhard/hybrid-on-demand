import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import type { Order, OrderStatus } from "@/types";

export function useOrders() {
  const userId = useAuthStore((s) => s.session?.user.id);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setError(null);
      setOrders((data ?? []) as Order[]);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const createOrder = useCallback(
    async (order: Omit<Order, "id" | "user_id" | "created_at" | "completed_at">) => {
      if (!userId) return { data: null, error: "Не авторизован" };
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert({ ...order, user_id: userId })
        .select()
        .single();
      if (insertError) return { data: null, error: insertError.message };
      await refetch();
      return { data: data as Order, error: null };
    },
    [userId, refetch]
  );

  const updateOrderStatus = useCallback(
    async (id: string, status: OrderStatus, extra?: Partial<Order>) => {
      const { data, error: updateError } = await supabase
        .from("orders")
        .update({ status, ...extra })
        .eq("id", id)
        .select()
        .single();
      if (updateError) return { data: null, error: updateError.message };
      return { data: data as Order, error: null };
    },
    []
  );

  return { orders, loading, error, refetch, createOrder, updateOrderStatus };
}
