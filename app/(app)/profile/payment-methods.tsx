import React from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import type { PaymentMethod } from "@/types";

const PROVIDER_META: Record<PaymentMethod["provider"], { label: string; icon: keyof typeof Feather.glyphMap }> = {
  card: { label: "Банковская карта", icon: "credit-card" },
  apple_pay: { label: "Apple Pay", icon: "smartphone" },
  google_pay: { label: "Google Pay", icon: "smartphone" },
};

export default function PaymentMethods() {
  const router = useRouter();
  const { methods, loading, removeMethod, setDefault } = usePaymentMethods();

  function confirmRemove(method: PaymentMethod) {
    Alert.alert("Удалить способ оплаты?", "", [
      { text: "Отмена", style: "cancel" },
      { text: "Удалить", style: "destructive", onPress: () => removeMethod(method.id) },
    ]);
  }

  return (
    <ScreenContainer scroll={false} padded={false}>
      <Header title="Способы оплаты" />
      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {!loading && methods.length === 0 ? (
          <View style={styles.empty}>
            <Feather name="credit-card" size={26} color={colors.textMuted} />
            <Text style={styles.emptyText}>Способы оплаты не добавлены</Text>
          </View>
        ) : (
          methods.map((method) => {
            const meta = PROVIDER_META[method.provider];
            return (
              <Card key={method.id} selected={method.is_default} style={styles.card} onPress={() => setDefault(method.id)}>
                <View style={styles.row}>
                  <View style={styles.iconWrap}>
                    <Feather name={meta.icon} size={18} color={colors.accent} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>
                      {method.brand ? `${method.brand} ` : ""}
                      {method.last4 ? `•••• ${method.last4}` : meta.label}
                    </Text>
                    <Text style={styles.sublabel}>{method.is_default ? "Используется по умолчанию" : meta.label}</Text>
                  </View>
                  <Feather
                    name="trash-2"
                    size={18}
                    color={colors.textMuted}
                    onPress={() => confirmRemove(method)}
                    suppressHighlighting
                  />
                </View>
              </Card>
            );
          })
        )}

        <Button
          label="Добавить карту"
          variant="secondary"
          icon={<Feather name="plus" size={18} color={colors.textPrimary} />}
          onPress={() => router.push("/(app)/profile/add-payment")}
          style={{ marginTop: spacing.sm }}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.lg, paddingBottom: spacing.xxxl },
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
  label: { ...typography.bodyMedium, color: colors.textPrimary },
  sublabel: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  empty: { alignItems: "center", justifyContent: "center", paddingVertical: spacing.xxxl, gap: spacing.sm },
  emptyText: { ...typography.body, color: colors.textMuted },
});
