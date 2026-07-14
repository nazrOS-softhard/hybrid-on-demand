import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import { translateAuthError } from "./login";

export default function ForgotPassword() {
  const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email) {
      setError("Введите e-mail или телефон");
      return;
    }
    setError(null);
    setLoading(true);
    const { error: resetError } = await requestPasswordReset(email.trim());
    setLoading(false);
    if (resetError) {
      setError(translateAuthError(resetError));
      return;
    }
    setSent(true);
  }

  return (
    <ScreenContainer>
      <Header title="" />
      <View style={styles.iconWrap}>
        <Feather name="lock" size={24} color={colors.accent} />
      </View>
      <Text style={styles.title}>Восстановление пароля</Text>
      <Text style={styles.subtitle}>
        Введите e-mail или телефон, мы отправим код для сброса пароля
      </Text>

      <View style={{ marginTop: spacing.xl }}>
        <Input
          label="E-mail или телефон"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          editable={!sent}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {sent ? (
          <View style={styles.successBox}>
            <Feather name="check-circle" size={18} color={colors.success} />
            <Text style={styles.successText}>
              Письмо со ссылкой для сброса пароля отправлено на {email}
            </Text>
          </View>
        ) : (
          <Button label="Отправить код" onPress={handleSubmit} loading={loading} />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
    marginBottom: spacing.sm,
  },
  successBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.successSoft,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  successText: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
  },
});
