import React, { useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Card } from "@/components/Card";
import { StatusBadge } from "@/components/StatusBadge";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useOrders } from "@/hooks/useOrders";
import type { Order } from "@/types";

const FILTERS = [
  { key: "all", label: "Все" },
  { key: "completed", label: "Завершённые" },
  { key: "cancelled", label: "Отменённые" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function History() {
  const { orders, loading, refetch } = useOrders();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((o) => o.status === filter);
  }, [orders, filter]);

  async function onRefresh() {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }

  return (
    <ScreenContainer scroll={false} padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>История заказов</Text>
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl tintColor={colors.accent} refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {!loading && filtered.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="inbox" size={28} color={colors.textMuted} />
            <Text style={styles.emptyText}>Заказов пока нет</Text>
          </View>
        ) : (
          filtered.map((order) => <OrderRow key={order.id} order={order} />)
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

function OrderRow({ order }: { order: Order }) {
  return (
    <Card style={styles.orderCard}>
      <View style={styles.orderRow}>
        <View style={styles.orderIconWrap}>
          <Feather name="zap" size={18} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderTitle}>
            {order.order_date} · {order.order_time}
          </Text>
          <Text style={styles.orderAddress} numberOfLines={1}>
            {order.address}
          </Text>
          <Text style={styles.orderMeta}>
            {order.car_brand} {order.car_model}
            {order.energy_kwh ? ` · ${order.energy_kwh} кВт·ч` : ""}
          </Text>
        </View>
        <View style={{ alignItems: "flex-end", gap: spacing.xs }}>
          <Text style={styles.orderPrice}>₽ {order.price.toLocaleString("ru-RU")}</Text>
          <StatusBadge status={order.status} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  filterText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.accent,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  orderCard: {
    marginBottom: spacing.md,
  },
  orderRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  orderIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  orderTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  orderAddress: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  orderMeta: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 2,
  },
  orderPrice: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: spacing.xxxl * 2,
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
  },
});
