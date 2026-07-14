import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import Constants from "expo-constants";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { ListRow } from "@/components/ListRow";
import { colors, spacing, typography } from "@/constants/theme";

export default function Settings() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [promoEnabled, setPromoEnabled] = useState(false);
  const [biometric, setBiometric] = useState(false);

  return (
    <ScreenContainer>
      <Header title="Настройки" />

      <Text style={styles.sectionTitle}>Уведомления</Text>
      <Card style={{ paddingVertical: spacing.xs }}>
        <SwitchRow label="Push-уведомления о заказах" value={pushEnabled} onChange={setPushEnabled} />
        <SwitchRow label="Акции и предложения" value={promoEnabled} onChange={setPromoEnabled} />
      </Card>

      <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Безопасность</Text>
      <Card style={{ paddingVertical: spacing.xs }}>
        <SwitchRow label="Вход по Face ID / отпечатку" value={biometric} onChange={setBiometric} />
        <ListRow icon="lock" label="Изменить пароль" onPress={() => {}} />
      </Card>

      <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>О приложении</Text>
      <Card style={{ paddingVertical: spacing.xs }}>
        <ListRow icon="file-text" label="Правила и условия" onPress={() => {}} />
        <ListRow icon="shield" label="Политика конфиденциальности" onPress={() => {}} showChevron />
        <View style={styles.versionRow}>
          <Text style={styles.versionText}>Версия {Constants.expoConfig?.version ?? "1.0.0"}</Text>
        </View>
      </Card>
    </ScreenContainer>
  );
}

function SwitchRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.switchRow}>
      <Text style={styles.switchLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.accent }}
        thumbColor="#fff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
  },
  switchLabel: { ...typography.body, color: colors.textPrimary, flex: 1, marginRight: spacing.md },
  versionRow: { paddingVertical: spacing.md, alignItems: "center" },
  versionText: { ...typography.small, color: colors.textMuted },
});
