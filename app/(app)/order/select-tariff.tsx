import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useTariffs } from "@/hooks/useTariffs";
import { useOrderStore } from "@/store/orderStore";

export default function SelectTariff() {
  const router = useRouter();
  const { tariffs, loading } = useTariffs();
  const tariff = useOrderStore((s) => s.tariff);
  const setTariff = useOrderStore((s) => s.setTariff);
  const [infoOpen, setInfoOpen] = useState(false);

  function handleContinue() {
    if (!tariff) return;
    router.push("/(app)/order/confirm");
  }

  return (
    <ScreenContainer scroll={false} padded={false}>
      <Header title="Выберите тариф" />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {tariffs.map((t) => (
          <Card key={t.id} selected={tariff?.id === t.id} onPress={() => setTariff(t)} style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconWrap}>
                <Feather name={t.is_night ? "moon" : "zap"} size={18} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{t.name}</Text>
                <Text style={styles.desc}>{t.description}</Text>
              </View>
              <Text style={styles.price}>₽ {t.price.toLocaleString("ru-RU")}</Text>
            </View>
          </Card>
        ))}

        <Pressable onPress={() => setInfoOpen((v) => !v)} style={styles.infoRow}>
          <Feather name="info" size={14} color={colors.accent} />
          <Text style={styles.infoText}>Подробнее о тарифах</Text>
        </Pressable>
        {infoOpen ? (
          <Text style={styles.infoBody}>
            Стоимость включает выезд мобильной станции, подключение и зарядку до выбранного
            процента. Финальная цена может измениться, если фактический расход энергии отличается
            от плана — вы увидите итог на экране подтверждения.
          </Text>
        ) : null}
      </ScrollView>

      <View style={styles.footer}>
        <Button label="Продолжить" onPress={handleContinue} disabled={!tariff || loading} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: spacing.lg },
  card: { marginBottom: spacing.md },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { ...typography.bodyMedium, color: colors.textPrimary },
  desc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  price: { ...typography.bodyMedium, color: colors.textPrimary },
  infoRow: { flexDirection: "row", alignItems: "center", gap: spacing.xs, marginTop: spacing.sm },
  infoText: { ...typography.caption, color: colors.accent },
  infoBody: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 19 },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
});
