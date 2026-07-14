import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";

export default function Login() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email || !password) {
      setError("Введите e-mail и пароль");
      return;
    }
    setError(null);
    setLoading(true);
    const { error: signInError } = await signIn({ email: email.trim(), password });
    setLoading(false);
    if (signInError) {
      setError(translateAuthError(signInError));
      return;
    }
    router.replace("/(app)/(tabs)/home");
  }

  return (
    <ScreenContainer>
      <View style={styles.iconWrap}>
        <Feather name="zap" size={26} color={colors.accent} />
      </View>
      <Text style={styles.title}>Добро пожаловать!</Text>
      <Text style={styles.subtitle}>Войдите, чтобы заказать мобильную зарядку</Text>

      <View style={{ marginTop: spacing.xl }}>
        <Input
          label="E-mail или телефон"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Пароль"
          placeholder="Введите пароль"
          secureToggle
          value={password}
          onChangeText={setPassword}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable hitSlop={8}>
            <Text style={styles.forgot}>Забыли пароль?</Text>
          </Pressable>
        </Link>

        <Button label="Войти" onPress={handleSubmit} loading={loading} style={{ marginTop: spacing.lg }} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Нет аккаунта? </Text>
        <Link href="/(auth)/register" asChild>
          <Pressable hitSlop={8}>
            <Text style={styles.link}>Зарегистрируйтесь</Text>
          </Pressable>
        </Link>
      </View>
    </ScreenContainer>
  );
}

export function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Неверный e-mail или пароль";
  if (m.includes("user already registered")) return "Пользователь с таким e-mail уже зарегистрирован";
  if (m.includes("password should be at least")) return "Пароль должен содержать не менее 6 символов";
  if (m.includes("unable to validate email")) return "Некорректный формат e-mail";
  if (m.includes("email not confirmed")) return "Подтвердите e-mail — мы отправили письмо со ссылкой";
  if (m.includes("network")) return "Нет соединения с сервером. Проверьте интернет";
  return message;
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xxl,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.h1,
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
  forgot: {
    ...typography.caption,
    color: colors.accent,
    textAlign: "right",
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xxl,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  link: {
    ...typography.bodyMedium,
    color: colors.accent,
  },
});
