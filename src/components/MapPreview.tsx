import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { Feather } from "@expo/vector-icons";
import { colors, radius } from "@/constants/theme";

// A stylised, offline map surface: subtle grid + accent route + pin.
// Avoids depending on react-native-maps / a Maps API key so the project
// builds out-of-the-box on EAS without extra credentials.
export function MapPreview({ height = 220 }: { height?: number }) {
  const gridLines = Array.from({ length: 7 });
  return (
    <View style={[styles.wrap, { height }]}>
      <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
        {gridLines.map((_, i) => (
          <Line
            key={`h-${i}`}
            x1="0"
            y1={`${(i + 1) * 12.5}%`}
            x2="100%"
            y2={`${(i + 1) * 12.5}%`}
            stroke={colors.border}
            strokeWidth={1}
          />
        ))}
        {gridLines.map((_, i) => (
          <Line
            key={`v-${i}`}
            x1={`${(i + 1) * 12.5}%`}
            y1="0"
            x2={`${(i + 1) * 12.5}%`}
            y2="100%"
            stroke={colors.border}
            strokeWidth={1}
          />
        ))}
        <Path
          d="M20,40 C90,20 140,90 210,70 S300,140 340,120"
          stroke={colors.accent}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
        />
        <Circle cx="70%" cy="55%" r="7" fill={colors.accent} />
        <Circle cx="70%" cy="55%" r="13" fill="none" stroke={colors.accent} strokeWidth={1.5} opacity={0.5} />
      </Svg>
      <View style={styles.pin}>
        <Feather name="zap" size={16} color="#fff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radius.lg,
    backgroundColor: colors.bgElevated,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
  },
  pin: {
    position: "absolute",
    top: "48%",
    left: "66%",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0A0A0F",
  },
});
