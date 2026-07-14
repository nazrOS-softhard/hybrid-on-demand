import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { CarListItem } from "@/components/CarListItem";
import { ListRow } from "@/components/ListRow";
import { Logo } from "@/components/Logo";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import { useCars } from "@/hooks/useCars";
import { useOrders } from "@/hooks/useOrders";
import { useOrderStore } from "@/store/orderStore";

export default function Home() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const { cars, loading } = useCars();
  const { orders } = useOrders();
  const resetOrder = useOrderStore((s) => s.reset);
  const setActiveOrderId = useOrderStore((s) => s.setActiveOrderId);

  const primaryCar = cars.find((c) => c.is_primary) ?? cars[0];
  const activeOrder = orders.find((o) =>
    ["pending", "confirmed", "en_route", "charging"].includes(o.status)
  );
  const displayName = profile?.full_name || session?.user.email?.split("@")[0] || "Гость";

  function startOrder() {
    resetOrder();
    router.push("/(app)/order/select-car");
  }

  function resumeActiveOrder() {
    if (!activeOrder) return;
    setActiveOrderId(activeOrder.id);
    if (activeOrder.status === "charging") {
      router.push("/(app)/order/charging");
    } else {
      router.push("/(app)/order/waiting");
    }
  }

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
          <Logo size={28} />
          <View>
            <Text style={styles.brand}>ГИБРИД</Text>
            <Text style={styles.brandSmall}>РАЗРЯД</Text>
          </View>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{displayName.slice(0, 1).toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.greetingLabel}>Здравствуйте,</Text>
      <Text style={styles.greetingName}>{displayName}</Text>

      {activeOrder ? (
        <Card onPress={resumeActiveOrder} style={styles.activeOrderCard}>
          <View style={styles.activeOrderRow}>
            <View style={styles.activeIconWrap}>
              <Feather name="navigation" size={18} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.activeOrderTitle}>
                {activeOrder.status === "charging" ? "Идёт зарядка" : "Заправка уже в пути"}
              </Text>
              <Text style={styles.activeOrderSubtitle}>{activeOrder.address}</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.textMuted} />
          </View>
        </Card>
      ) : null}

      <Text style={styles.sectionTitle}>Ваш автомобиль</Text>
      {loading ? (
        <Card>
          <Text style={styles.emptyText}>Загрузка...</Text>
        </Card>
      ) : primaryCar ? (
        <CarListItem car={primaryCar} />
      ) : (
        <Card onPress={() => router.push("/(app)/cars/add")}>
          <View style={styles.emptyCarRow}>
            <Feather name="plus-circle" size={20} color={colors.accent} />
            <Text style={styles.emptyCarText}>Добавьте свой первый автомобиль</Text>
          </View>
        </Card>
      )}

      <Button
        label="Заказать заправку"
        onPress={startOrder}
        disabled={!primaryCar}
        style={{ marginTop: spacing.lg }}
      />

      <View style={{ marginTop: spacing.xxl }}>
        <ListRow icon="clock" label="История заказов" onPress={() => router.push("/(app)/(tabs)/history")} />
        <ListRow icon="zap" label="Мои автомобили" onPress={() => router.push("/(app)/(tabs)/cars")} />
        <ListRow
          icon="credit-card"
          label="Способы оплаты"
          onPress={() => router.push("/(app)/profile/payment-methods")}
        />
        <ListRow icon="settings" label="Настройки" onPress={() => router.push("/(app)/profile/settings")} showChevron />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  brand: {
    ...typography.small,
    color: colors.textPrimary,
    letterSpacing: 1.5,
  },
  brandSmall: {
    ...typography.small,
    color: colors.accent,
    letterSpacing: 1.5,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
  greetingLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  greetingName: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  activeOrderCard: {
    marginBottom: spacing.lg,
    borderColor: colors.accent,
  },
  activeOrderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  activeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  activeOrderTitle: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  activeOrderSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  emptyCarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  emptyCarText: {
    ...typography.body,
    color: colors.textPrimary,
  },
});
