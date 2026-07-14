import React, { useState } from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { ListRow } from "@/components/ListRow";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { FAQ_ITEMS } from "@/lib/supabase";

export default function Support() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Поддержка</Text>
      <Text style={styles.subtitle}>Мы на связи 24/7</Text>

      <Text style={styles.sectionTitle}>Частые вопросы</Text>
      {FAQ_ITEMS.map((item, index) => {
        const open = openIndex === index;
        return (
          <Card key={item.question} style={styles.faqCard}>
            <Pressable onPress={() => setOpenIndex(open ? null : index)} style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{item.question}</Text>
              <Feather name={open ? "chevron-up" : "chevron-down"} size={18} color={colors.textMuted} />
            </Pressable>
            {open ? <Text style={styles.faqAnswer}>{item.answer}</Text> : null}
          </Card>
        );
      })}

      <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Ещё</Text>
      <Card style={{ paddingVertical: spacing.xs }}>
        <ListRow
          icon="message-square"
          label="Связаться с поддержкой"
          onPress={() => Linking.openURL("mailto:support@gibrid-razryad.ru")}
        />
        <ListRow icon="info" label="О приложении" onPress={() => {}} />
        <ListRow icon="file-text" label="Правила и условия" onPress={() => {}} showChevron />
      </Card>

      <Button
        label="Позвонить в поддержку"
        onPress={() => Linking.openURL("tel:+78001234567")}
        icon={<Feather name="phone-call" size={18} color="#fff" />}
        style={{ marginTop: spacing.xl }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.h1, color: colors.textPrimary, marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  sectionTitle: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.sm },
  faqCard: { marginBottom: spacing.sm, padding: spacing.md },
  faqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md },
  faqQuestion: { ...typography.bodyMedium, color: colors.textPrimary, flex: 1 },
  faqAnswer: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm, lineHeight: 19 },
});
