import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Button } from "@/components/Button";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useOrderStore } from "@/store/orderStore";
import { useOrders } from "@/hooks/useOrders";
import { useCars } from "@/hooks/useCars";

export default function Complete() {
  const router = useRouter();
  const draft = useOrderStore();
  const { orders, refetch } = useOrders();
  const { refetch: refetchCars } = useCars();

  const order = orders.find((o) => o.id === draft.activeOrderId);
  const finalPercent = order?.battery_end ?? draft.tariff?.target_percent ?? 100;
  const energy = order?.energy_kwh ?? 0;
  const duration = order?.duration_minutes ?? 0;

  function handleDone() {
    draft.reset();
    refetch();
    refetchCars();
    router.replace("/(app)/(tabs)/home");
  }

  return (
    <ScreenContainer>
      <View style={styles.center}>
        <View style={styles.checkWrap}>
          <Feather name="check" size={40} color="#fff" />
        </View>
        <Text style={styles.title}>Зарядка завершена</Text>
        <Text style={styles.time}>
          {order?.completed_at
            ? new Date(order.completed_at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
            : ""}
        </Text>
      </View>

      <View style={styles.percentWrap}>
        <Text style={styles.percentValue}>{finalPercent}%</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{energy} кВт·ч</Text>
          <Text style={styles.statLabel}>Передано энергии</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{duration} мин</Text>
          <Text style={styles.statLabel}>Длительность</Text>
        </View>
      </View>

      {order ? (
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>Списано за зарядку</Text>
          <Text style={styles.priceValue}>₽ {order.price.toLocaleString("ru-RU")}</Text>
        </View>
      ) : null}

      <Text style={styles.thanks}>Спасибо, что выбрали Гибрид Разряд!</Text>

      <Button label="Готово" onPress={handleDone} style={{ marginTop: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: "center", marginTop: spacing.xl },
  checkWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },
  title: { ...typography.h2, color: colors.textPrimary },
  time: { ...typography.body, color: colors.textSecondary, marginTop: spacing.xs },
  percentWrap: { alignItems: "center", marginVertical: spacing.xxl },
  percentValue: { fontSize: 64, fontWeight: "700", color: colors.textPrimary },
  statsRow: { flexDirection: "row", gap: spacing.md, marginBottom: spacing.lg },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.lg, alignItems: "center" },
  statValue: { ...typography.h3, color: colors.textPrimary },
  statLabel: { ...typography.small, color: colors.textSecondary, marginTop: 4, textAlign: "center" },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  priceLabel: { ...typography.body, color: colors.textSecondary },
  priceValue: { ...typography.bodyMedium, color: colors.textPrimary },
  thanks: { ...typography.body, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xl },
});
