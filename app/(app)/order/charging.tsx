import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Button } from "@/components/Button";
import { ProgressRing } from "@/components/ProgressRing";
import { colors, spacing, typography } from "@/constants/theme";
import { useOrderStore } from "@/store/orderStore";
import { useOrders } from "@/hooks/useOrders";

const TICK_MS = 400; // demo speed: charging progresses quickly for a smooth in-app demo
const KWH_PER_PERCENT = 0.62; // approximate battery capacity assumption for realistic kWh display

export default function Charging() {
  const router = useRouter();
  const draft = useOrderStore();
  const { updateOrderStatus } = useOrders();

  const startPercent = draft.car?.battery_percent ?? 40;
  const targetPercent = draft.tariff?.target_percent ?? 100;
  const [percent, setPercent] = useState(startPercent);
  const [elapsedSec, setElapsedSec] = useState(0);
  const finishedRef = useRef(false);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (percent >= targetPercent) {
      if (!finishedRef.current && draft.activeOrderId) {
        finishedRef.current = true;
        const durationMinutes = Math.max(1, Math.round((Date.now() - startedAt.current) / 60000) || Math.round(elapsedSec / 60) || 1);
        const energy = Number(((targetPercent - startPercent) * KWH_PER_PERCENT).toFixed(1));
        updateOrderStatus(draft.activeOrderId, "completed", {
          battery_end: targetPercent,
          energy_kwh: Math.max(energy, 1),
          duration_minutes: durationMinutes,
          completed_at: new Date().toISOString(),
        }).finally(() => {
          router.replace("/(app)/order/complete");
        });
      }
      return;
    }
    const timer = setTimeout(() => {
      setPercent((p) => Math.min(targetPercent, p + 1));
      setElapsedSec((s) => s + 38);
    }, TICK_MS);
    return () => clearTimeout(timer);
  }, [percent, targetPercent]);

  function stopCharging() {
    Alert.alert("Остановить зарядку?", "Заряд будет зафиксирован на текущем уровне", [
      { text: "Отмена", style: "cancel" },
      {
        text: "Остановить",
        style: "destructive",
        onPress: async () => {
          if (draft.activeOrderId) {
            const energy = Number(((percent - startPercent) * KWH_PER_PERCENT).toFixed(1));
            await updateOrderStatus(draft.activeOrderId, "completed", {
              battery_end: percent,
              energy_kwh: Math.max(energy, 0.1),
              duration_minutes: Math.max(1, Math.round(elapsedSec / 60)),
              completed_at: new Date().toISOString(),
            });
          }
          router.replace("/(app)/order/complete");
        },
      },
    ]);
  }

  const energyDelivered = Math.max(0, ((percent - startPercent) * KWH_PER_PERCENT)).toFixed(1);
  const minutes = Math.floor(elapsedSec / 60);
  const seconds = elapsedSec % 60;

  return (
    <ScreenContainer>
      <Text style={styles.title}>Зарядка началась</Text>
      <Text style={styles.subtitle}>
        {new Date(startedAt.current).getHours().toString().padStart(2, "0")}:
        {new Date(startedAt.current).getMinutes().toString().padStart(2, "0")}
      </Text>

      <View style={styles.ringWrap}>
        <ProgressRing percent={percent} label="Заряжено" size={240} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{energyDelivered} кВт·ч</Text>
          <Text style={styles.statLabel}>Передано энергии</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
          </Text>
          <Text style={styles.statLabel}>
            До {targetPercent}% · {draft.tariff?.name ?? ""}
          </Text>
        </View>
      </View>

      <Button label="Остановить зарядку" variant="danger" onPress={stopCharging} style={{ marginTop: spacing.xl }} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h2, color: colors.textPrimary, textAlign: "center", marginTop: spacing.lg },
  subtitle: { ...typography.body, color: colors.textSecondary, textAlign: "center", marginTop: spacing.xs },
  ringWrap: { alignItems: "center", marginVertical: spacing.xxl },
  statsRow: { flexDirection: "row", gap: spacing.md },
  statCard: { flex: 1, backgroundColor: colors.card, borderRadius: 16, padding: spacing.lg, alignItems: "center" },
  statValue: { ...typography.h3, color: colors.textPrimary },
  statLabel: { ...typography.small, color: colors.textSecondary, marginTop: 4, textAlign: "center" },
});
