import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";

function detectBrand(cardNumber: string) {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.startsWith("4")) return "Visa";
  if (/^5[1-5]/.test(digits)) return "Mastercard";
  if (/^220[0-4]/.test(digits)) return "Мир";
  return "Карта";
}

export default function AddPayment() {
  const router = useRouter();
  const { addMethod } = usePaymentMethods();
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    const digits = cardNumber.replace(/\D/g, "");
    if (digits.length < 12) {
      setError("Введите корректный номер карты");
      return;
    }
    setError(null);
    setLoading(true);
    const { error: addError } = await addMethod({
      provider: "card",
      brand: detectBrand(cardNumber),
      last4: digits.slice(-4),
      is_default: true,
    });
    setLoading(false);
    if (addError) {
      setError(addError);
      return;
    }
    router.back();
  }

  return (
    <ScreenContainer>
      <Header title="Новая карта" />

      <Input
        label="Номер карты"
        placeholder="0000 0000 0000 0000"
        keyboardType="number-pad"
        value={cardNumber}
        onChangeText={setCardNumber}
        maxLength={19}
      />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Input label="Срок действия" placeholder="ММ/ГГ" value={expiry} onChangeText={setExpiry} maxLength={5} />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="CVV" placeholder="123" keyboardType="number-pad" value={cvv} onChangeText={setCvv} secureToggle maxLength={3} />
        </View>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button label="Привязать карту" onPress={handleSubmit} loading={loading} style={{ marginTop: spacing.md }} />

      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>или</Text>
        <View style={styles.dividerLine} />
      </View>

      <Pressable
        style={styles.walletRow}
        onPress={async () => {
          setLoading(true);
          await addMethod({ provider: "apple_pay", brand: "Apple Pay", last4: null, is_default: true });
          setLoading(false);
          router.back();
        }}
      >
        <Feather name="smartphone" size={18} color={colors.textPrimary} />
        <Text style={styles.walletLabel}>Apple Pay</Text>
      </Pressable>
      <Pressable
        style={styles.walletRow}
        onPress={async () => {
          setLoading(true);
          await addMethod({ provider: "google_pay", brand: "Google Pay", last4: null, is_default: true });
          setLoading(false);
          router.back();
        }}
      >
        <Feather name="smartphone" size={18} color={colors.textPrimary} />
        <Text style={styles.walletLabel}>Google Pay</Text>
      </Pressable>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.md },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.sm },
  divider: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginVertical: spacing.xl },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { ...typography.caption, color: colors.textMuted },
  walletRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  walletLabel: { ...typography.bodyMedium, color: colors.textPrimary },
});
