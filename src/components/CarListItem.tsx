import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Card } from "@/components/Card";
import { colors, radius, spacing, typography } from "@/constants/theme";
import type { Car } from "@/types";

export function CarListItem({
  car,
  selected,
  onPress,
}: {
  car: Car;
  selected?: boolean;
  onPress?: () => void;
}) {
  return (
    <Card onPress={onPress} selected={selected} style={styles.card}>
      <View style={styles.iconWrap}>
        <Feather name="zap" size={20} color={colors.accent} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>
          {car.brand} {car.model}
        </Text>
        <Text style={styles.subtitle}>
          {car.battery_percent}% · {car.range_km} км
          {car.plate_number ? ` · ${car.plate_number}` : ""}
        </Text>
      </View>
      {car.is_primary ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Основной</Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.successSoft,
  },
  badgeText: {
    ...typography.small,
    color: colors.success,
  },
});
