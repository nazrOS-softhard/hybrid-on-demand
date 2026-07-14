import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors, spacing, typography } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import { translateAuthError } from "./login";

export default function Register() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!fullName || !email || !password) {
      setError("Заполните имя, e-mail и пароль");
      return;
    }
    if (password.length < 6) {
      setError("Пароль должен содержать не менее 6 символов");
      return;
    }
    setError(null);
    setLoading(true);
    const { error: signUpError } = await signUp({
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      phone: phone.trim(),
    });
    setLoading(false);
    if (signUpError) {
      setError(translateAuthError(signUpError));
      return;
    }
    router.replace("/(app)/(tabs)/home");
  }

  return (
    <ScreenContainer>
      <Header title="" />
      <Text style={styles.title}>Создайте аккаунт</Text>
      <Text style={styles.subtitle}>Это займёт меньше минуты</Text>

      <View style={{ marginTop: spacing.xl }}>
        <Input label="Имя" placeholder="Ваше имя" value={fullName} onChangeText={setFullName} />
        <Input
          label="E-mail"
          placeholder="you@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <Input
          label="Телефон"
          placeholder="+7 (___) ___-__-__"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <Input label="Пароль" placeholder="Минимум 6 символов" secureToggle value={password} onChangeText={setPassword} />
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button
          label="Зарегистрироваться"
          onPress={handleSubmit}
          loading={loading}
          style={{ marginTop: spacing.lg }}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Уже есть аккаунт? </Text>
        <Link href="/(auth)/login" asChild>
          <Pressable hitSlop={8}>
            <Text style={styles.link}>Войти</Text>
          </Pressable>
        </Link>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    marginTop: spacing.sm,
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.xl,
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
