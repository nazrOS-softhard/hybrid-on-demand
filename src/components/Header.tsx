import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { colors, radius, spacing, typography } from "@/constants/theme";

type Props = {
  title?: string;
  onBack?: () => void;
  right?: React.ReactNode;
  showBack?: boolean;
};

export function Header({ title, onBack, right, showBack = true }: Props) {
  const router = useRouter();
  return (
    <View style={styles.row}>
      {showBack ? (
        <Pressable
          style={styles.iconButton}
          onPress={() => (onBack ? onBack() : router.back())}
          hitSlop={10}
        >
          <Feather name="chevron-left" size={22} color={colors.textPrimary} />
        </Pressable>
      ) : (
        <View style={styles.iconButton} />
      )}
      {title ? <Text style={styles.title}>{title}</Text> : <View />}
      {right ?? <View style={styles.iconButton} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
});
