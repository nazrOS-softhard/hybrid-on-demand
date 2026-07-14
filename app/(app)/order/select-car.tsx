import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { CarListItem } from "@/components/CarListItem";
import { colors, spacing, typography } from "@/constants/theme";
import { useCars } from "@/hooks/useCars";
import { useOrderStore } from "@/store/orderStore";

export default function SelectCar() {
  const router = useRouter();
  const { cars, loading } = useCars();
  const selectedCar = useOrderStore((s) => s.car);
  const setCar = useOrderStore((s) => s.setCar);

  function handleContinue() {
    if (!selectedCar) return;
    router.push("/(app)/order/select-address");
  }

  return (
    <ScreenContainer scroll={false} padded={false}>
      <Header title="Мои автомобили" />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {!loading && cars.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="zap" size={26} color={colors.textMuted} />
            <Text style={styles.emptyText}>Добавьте автомобиль, чтобы заказать зарядку</Text>
            <Button label="Добавить автомобиль" onPress={() => router.push("/(app)/cars/add")} style={{ marginTop: spacing.lg }} />
          </View>
        ) : (
          cars.map((car) => (
            <CarListItem key={car.id} car={car} selected={selectedCar?.id === car.id} onPress={() => setCar(car)} />
          ))
        )}
      </ScrollView>
      {cars.length > 0 ? (
        <View style={styles.footer}>
          <Button label="Продолжить" onPress={handleContinue} disabled={!selectedCar} />
        </View>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: spacing.lg },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, paddingTop: spacing.sm },
  empty: { alignItems: "center", paddingVertical: spacing.xxxl, gap: spacing.sm, paddingHorizontal: spacing.xl },
  emptyText: { ...typography.body, color: colors.textMuted, textAlign: "center" },
});
