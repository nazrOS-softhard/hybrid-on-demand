import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Path, Stop } from "react-native-svg";
import { colors, typography } from "@/constants/theme";

export function Logo({ size = 64, withWordmark = false }: { size?: number; withWordmark?: boolean }) {
  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        <Defs>
          <LinearGradient id="logo" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.accentGradient[0]} />
            <Stop offset="1" stopColor={colors.accentGradient[1]} />
          </LinearGradient>
        </Defs>
        <Path
          d="M36 4 L14 34 H28 L24 60 L52 26 H36 L36 4 Z"
          fill="url(#logo)"
          strokeLinejoin="round"
        />
      </Svg>
      {withWordmark ? (
        <View style={styles.wordmark}>
          <Text style={styles.title}>ГИБРИД РАЗРЯД</Text>
          <Text style={styles.subtitle}>Мобильная электрозаправка нового поколения</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center" },
  wordmark: { alignItems: "center", marginTop: 16 },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },
});
