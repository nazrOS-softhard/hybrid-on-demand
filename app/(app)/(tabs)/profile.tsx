import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";

export default function Profile() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const signOut = useAuthStore((s) => s.signOut);

  const displayName = profile?.full_name || "Пользователь";
  const email = profile?.email || session?.user.email || "";

  function confirmSignOut() {
    Alert.alert("Выйти из аккаунта?", "Вам нужно будет снова войти, чтобы заказать зарядку", [
      { text: "Отмена", style: "cancel" },
      { text: "Выйти", style: "destructive", onPress: () => signOut() },
    ]);
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Профиль</Text>

      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{displayName.slice(0, 1).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{displayName}</Text>
        {email ? <Text style={styles.email}>{email}</Text> : null}
      </Card>

      <Card style={{ paddingVertical: spacing.xs, marginTop: spacing.lg }}>
        <ListRow icon="user" label="Личные данные" onPress={() => router.push("/(app)/profile/edit")} />
        <ListRow icon="bell" label="Уведомления" onPress={() => router.push("/(app)/profile/settings")} />
        <ListRow icon="credit-card" label="Способы оплаты" onPress={() => router.push("/(app)/profile/payment-methods")} />
        <ListRow icon="shield" label="Безопасность" onPress={() => router.push("/(app)/profile/settings")} showChevron />
      </Card>

      <Card style={{ paddingVertical: spacing.xs, marginTop: spacing.lg }}>
        <ListRow icon="log-out" label="Выйти из аккаунта" danger onPress={confirmSignOut} showChevron={false} />
      </Card>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.sm, marginBottom: spacing.lg },
  profileCard: { alignItems: "center", paddingVertical: spacing.xl },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  avatarText: { fontSize: 28, fontWeight: "700", color: colors.accent },
  name: { ...typography.h3, color: colors.textPrimary },
  email: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
});
