import React, { useState } from "react";
import { Text } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors, spacing, typography } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";

export default function EditProfile() {
  const router = useRouter();
  const profile = useAuthStore((s) => s.profile);
  const session = useAuthStore((s) => s.session);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setError(null);
    setLoading(true);
    const { error: updateError } = await updateProfile({ full_name: fullName.trim(), phone: phone.trim() });
    setLoading(false);
    if (updateError) {
      setError(updateError);
      return;
    }
    setSaved(true);
    setTimeout(() => router.back(), 600);
  }

  return (
    <ScreenContainer>
      <Header title="Личные данные" />
      <Input label="Имя" value={fullName} onChangeText={setFullName} placeholder="Ваше имя" />
      <Input label="Телефон" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+7 (___) ___-__-__" />
      <Input label="E-mail" value={session?.user.email ?? ""} editable={false} />
      {error ? <Text style={{ ...typography.caption, color: colors.danger, marginBottom: spacing.sm }}>{error}</Text> : null}
      {saved ? <Text style={{ ...typography.caption, color: colors.success, marginBottom: spacing.sm }}>Сохранено</Text> : null}
      <Button label="Сохранить" onPress={handleSave} loading={loading} style={{ marginTop: spacing.md }} />
    </ScreenContainer>
  );
}
