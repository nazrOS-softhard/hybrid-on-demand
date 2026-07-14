import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Props = {
  icon?: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  danger?: boolean;
  right?: React.ReactNode;
  showChevron?: boolean;
};

export function ListRow({ icon, label, onPress, danger, right, showChevron = true }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.7 : 1 }]}
    >
      {icon ? (
        <View style={[styles.iconWrap, danger && styles.iconWrapDanger]}>
          <Feather name={icon} size={17} color={danger ? colors.danger : colors.accent} />
        </View>
      ) : null}
      <Text style={[styles.label, danger && styles.labelDanger]}>{label}</Text>
      {right ?? (showChevron && <Feather name="chevron-right" size={18} color={colors.textMuted} />)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapDanger: {
    backgroundColor: colors.dangerSoft,
  },
  label: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
  labelDanger: {
    color: colors.danger,
  },
});
