import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useCars } from "@/hooks/useCars";
import type { Car } from "@/types";

export default function Cars() {
  const router = useRouter();
  const { cars, loading, removeCar } = useCars();

  function confirmRemove(car: Car) {
    Alert.alert(
      "Удалить автомобиль?",
      `${car.brand} ${car.model} будет удалён из вашего аккаунта`,
      [
        { text: "Отмена", style: "cancel" },
        { text: "Удалить", style: "destructive", onPress: () => removeCar(car.id) },
      ]
    );
  }

  return (
    <ScreenContainer scroll={false} padded={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Мои автомобили</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {!loading && cars.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="zap" size={28} color={colors.textMuted} />
            <Text style={styles.emptyText}>Вы ещё не добавили ни одного автомобиля</Text>
          </View>
        ) : (
          cars.map((car) => (
            <Card key={car.id} style={styles.card}>
              <View style={styles.row}>
                <View style={styles.iconWrap}>
                  <Feather name="zap" size={20} color={colors.accent} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.carTitle}>
                    {car.brand} {car.model}
                  </Text>
                  <Text style={styles.carSubtitle}>
                    {car.battery_percent}% · {car.range_km} км
                  </Text>
                  {car.plate_number ? <Text style={styles.carPlate}>{car.plate_number}</Text> : null}
                </View>
                <Feather
                  name="trash-2"
                  size={18}
                  color={colors.textMuted}
                  onPress={() => confirmRemove(car)}
                  suppressHighlighting
                />
              </View>
              {car.is_primary ? (
                <View style={styles.primaryBadge}>
                  <Text style={styles.primaryBadgeText}>Основной автомобиль</Text>
                </View>
              ) : null}
            </Card>
          ))
        )}

        <Button
          label="Добавить автомобиль"
          variant="secondary"
          icon={<Feather name="plus" size={18} color={colors.textPrimary} />}
          onPress={() => router.push("/(app)/cars/add")}
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  title: { ...typography.h2, color: colors.textPrimary },
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  card: { marginBottom: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  carTitle: { ...typography.bodyMedium, color: colors.textPrimary },
  carSubtitle: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  carPlate: { ...typography.small, color: colors.textMuted, marginTop: 2 },
  primaryBadge: {
    marginTop: spacing.md,
    alignSelf: "flex-start",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.successSoft,
  },
  primaryBadgeText: { ...typography.small, color: colors.success },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xxxl * 1.5,
    gap: spacing.sm,
  },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: "center" },
});
