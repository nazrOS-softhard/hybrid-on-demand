import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useOrderStore } from "@/store/orderStore";
import { useOrders } from "@/hooks/useOrders";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

export default function ConfirmOrder() {
  const router = useRouter();
  const draft = useOrderStore();
  const { createOrder } = useOrders();
  const { methods } = usePaymentMethods();
  const setActiveOrderId = useOrderStore((s) => s.setActiveOrderId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultMethod = methods.find((m) => m.is_default) ?? methods[0];
  const ready = draft.car && draft.address && draft.date && draft.time && draft.tariff;

  async function handleConfirm() {
    if (!ready || !draft.car || !draft.tariff) return;
    setError(null);
    setLoading(true);
    const { data, error: createError } = await createOrder({
      car_id: draft.car.id,
      car_brand: draft.car.brand,
      car_model: draft.car.model,
      address: draft.address!,
      latitude: draft.latitude,
      longitude: draft.longitude,
      order_date: draft.date!,
      order_time: draft.time!,
      tariff_id: draft.tariff.id.startsWith("fallback") ? null : draft.tariff.id,
      tariff_name: draft.tariff.name,
      price: draft.tariff.price,
      status: "en_route",
      battery_start: draft.car.battery_percent,
      battery_end: null,
      energy_kwh: null,
      duration_minutes: null,
    });
    setLoading(false);
    if (createError || !data) {
      setError(createError ?? "Не удалось создать заказ");
      return;
    }
    setActiveOrderId(data.id);
    router.replace("/(app)/order/waiting");
  }

  if (!ready) {
    return (
      <ScreenContainer>
        <Header title="Подтвердите заказ" />
        <Text style={styles.warning}>Заполните все шаги заказа заново.</Text>
        <Button label="Вернуться к заказу" onPress={() => router.replace("/(app)/order/select-car")} style={{ marginTop: spacing.lg }} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scroll={false} padded={false}>
      <Header title="Подтвердите заказ" />
      <View style={styles.content}>
        <Card style={styles.card}>
          <Row icon="zap" label="Автомобиль" value={`${draft.car!.brand} ${draft.car!.model}`} />
          <Divider />
          <Row icon="map-pin" label="Адрес" value={draft.address!} />
          <Divider />
          <Row icon="calendar" label="Дата и время" value={`${draft.date}, ${draft.time}`} />
          <Divider />
          <Row icon="battery-charging" label="Тариф" value={`${draft.tariff!.name} (${draft.tariff!.description})`} />
          <Divider />
          <Row
            icon="credit-card"
            label="Оплата"
            value={
              defaultMethod
                ? `${defaultMethod.brand ?? ""}${defaultMethod.last4 ? ` •••• ${defaultMethod.last4}` : ""}`
                : "Способ оплаты не выбран"
            }
          />
        </Card>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Стоимость</Text>
          <Text style={styles.totalValue}>₽ {draft.tariff!.price.toLocaleString("ru-RU")}</Text>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>

      <View style={styles.footer}>
        <Button label="Подтвердить" onPress={handleConfirm} loading={loading} />
      </View>
    </ScreenContainer>
  );
}

function Row({ icon, label, value }: { icon: keyof typeof Feather.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Feather name={icon} size={16} color={colors.accent} style={{ width: 24 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.lg },
  card: { padding: spacing.lg },
  row: { flexDirection: "row", gap: spacing.sm, paddingVertical: spacing.sm },
  rowLabel: { ...typography.small, color: colors.textMuted },
  rowValue: { ...typography.body, color: colors.textPrimary, marginTop: 2 },
  divider: { height: 1, backgroundColor: colors.border },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xs,
  },
  totalLabel: { ...typography.body, color: colors.textSecondary },
  totalValue: { ...typography.h2, color: colors.textPrimary },
  error: { ...typography.caption, color: colors.danger, marginTop: spacing.md },
  warning: { ...typography.body, color: colors.textSecondary, marginTop: spacing.lg },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
});
