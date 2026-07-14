import React, { useEffect, useRef, useState } from "react";
import { Alert, Linking, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { MapPreview } from "@/components/MapPreview";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useOrderStore } from "@/store/orderStore";
import { useOrders } from "@/hooks/useOrders";

const ETA_SECONDS = 5 * 60; // demo: 5-minute simulated dispatch window

export default function Waiting() {
  const router = useRouter();
  const draft = useOrderStore();
  const { updateOrderStatus } = useOrders();
  const [secondsLeft, setSecondsLeft] = useState(ETA_SECONDS);
  const navigatedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0 && !navigatedRef.current && draft.activeOrderId) {
      navigatedRef.current = true;
      updateOrderStatus(draft.activeOrderId, "charging").finally(() => {
        router.replace("/(app)/order/charging");
      });
    }
  }, [secondsLeft, draft.activeOrderId, router, updateOrderStatus]);

  const eta = new Date(Date.now() + secondsLeft * 1000);
  const etaLabel = `${eta.getHours().toString().padStart(2, "0")}:${eta.getMinutes().toString().padStart(2, "0")}`;

  function cancelOrder() {
    Alert.alert("Отменить заказ?", "Средства списаны не будут", [
      { text: "Нет", style: "cancel" },
      {
        text: "Отменить заказ",
        style: "destructive",
        onPress: async () => {
          if (draft.activeOrderId) {
            await updateOrderStatus(draft.activeOrderId, "cancelled");
          }
          draft.reset();
          router.replace("/(app)/(tabs)/home");
        },
      },
    ]);
  }

  return (
    <ScreenContainer scroll={false} padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Мы уже в пути</Text>
      </View>

      <View style={styles.content}>
        <MapPreview height={260} />

        <View style={styles.etaWrap}>
          <Text style={styles.etaLabel}>Ожидаемое время прибытия</Text>
          <Text style={styles.etaValue}>{etaLabel}</Text>
        </View>

        <Card style={styles.driverCard}>
          <View style={styles.driverRow}>
            <View style={styles.driverIcon}>
              <Feather name="truck" size={20} color={colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverTitle}>Гибрид Разряд-08</Text>
              <Text style={styles.driverSubtitle}>
                {draft.tariff?.is_night ? "Ночная зарядка" : "Мобильная зарядная станция"}
              </Text>
            </View>
          </View>
        </Card>

        <Button
          label="Связаться с оператором"
          variant="secondary"
          icon={<Feather name="phone" size={18} color={colors.textPrimary} />}
          onPress={() => Linking.openURL("tel:+78001234567")}
          style={{ marginTop: spacing.md }}
        />
        <Button label="Отменить заказ" variant="ghost" onPress={cancelOrder} style={{ marginTop: spacing.sm }} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  title: { ...typography.h2, color: colors.textPrimary },
  content: { flex: 1, padding: spacing.lg },
  etaWrap: { alignItems: "center", marginVertical: spacing.xl },
  etaLabel: { ...typography.caption, color: colors.textSecondary },
  etaValue: { fontSize: 44, fontWeight: "700", color: colors.textPrimary, marginTop: 4 },
  driverCard: { marginBottom: spacing.sm },
  driverRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  driverIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  driverTitle: { ...typography.bodyMedium, color: colors.textPrimary },
  driverSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
