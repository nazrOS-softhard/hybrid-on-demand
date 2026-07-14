import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { MapPreview } from "@/components/MapPreview";
import { Card } from "@/components/Card";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useOrderStore } from "@/store/orderStore";
import { useAuthStore } from "@/store/authStore";

const SAVED_ADDRESSES = [
  { label: "Мой адрес", address: "ул. Ленина, д. 25, кв. 25", lat: 55.751244, lng: 37.618423 },
  { label: "Работа", address: "Пресненская наб., 12", lat: 55.7497, lng: 37.5378 },
];

export default function SelectAddress() {
  const router = useRouter();
  const setAddress = useOrderStore((s) => s.setAddress);
  const car = useOrderStore((s) => s.car);
  const [query, setQuery] = useState("");

  function choose(address: string, lat: number, lng: number) {
    setAddress(address, lat, lng);
  }

  function handleContinue() {
    if (query.trim()) {
      choose(query.trim(), 55.751244, 37.618423);
    }
    router.push("/(app)/order/select-time");
  }

  return (
    <ScreenContainer scroll={false} padded={false}>
      <Header title="Куда приедем?" />
      <View style={styles.content}>
        <MapPreview />

        <Input
          placeholder="Введите адрес"
          value={query}
          onChangeText={setQuery}
          style={{ marginTop: spacing.lg }}
        />

        <Text style={styles.sectionTitle}>Сохранённые адреса</Text>
        {SAVED_ADDRESSES.map((item) => (
          <Card key={item.label} onPress={() => { setQuery(item.address); choose(item.address, item.lat, item.lng); }} style={styles.addressCard}>
            <View style={styles.addressRow}>
              <View style={styles.iconWrap}>
                <Feather name={item.label === "Работа" ? "briefcase" : "home"} size={18} color={colors.accent} />
              </View>
              <View>
                <Text style={styles.addressLabel}>{item.label}</Text>
                <Text style={styles.addressText}>{item.address}</Text>
              </View>
            </View>
          </Card>
        ))}

        {!car ? (
          <Text style={styles.warning}>Сначала выберите автомобиль на предыдущем шаге.</Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        <Button label="Продолжить" onPress={handleContinue} disabled={!query.trim()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.lg },
  sectionTitle: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.xl, marginBottom: spacing.sm },
  addressCard: { marginBottom: spacing.md },
  addressRow: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  addressLabel: { ...typography.bodyMedium, color: colors.textPrimary },
  addressText: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  warning: { ...typography.caption, color: colors.warning, marginTop: spacing.lg },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
});
