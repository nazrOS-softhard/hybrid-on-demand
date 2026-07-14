import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "@/constants/theme";
import type { OrderStatus } from "@/types";

const STATUS_META: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Ожидание", color: colors.warning, bg: "rgba(251,191,36,0.12)" },
  confirmed: { label: "Подтверждён", color: colors.accent, bg: colors.accentSoft },
  en_route: { label: "В пути", color: colors.accent, bg: colors.accentSoft },
  charging: { label: "Заряжается", color: colors.accent, bg: colors.accentSoft },
  completed: { label: "Завершён", color: colors.success, bg: colors.successSoft },
  cancelled: { label: "Отменён", color: colors.danger, bg: colors.dangerSoft },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <View style={[styles.badge, { backgroundColor: meta.bg }]}>
      <Text style={[styles.text, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  text: {
    ...typography.small,
  },
});
