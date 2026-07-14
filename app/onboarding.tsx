import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Button } from "@/components/Button";
import { Dots } from "@/components/Dots";
import { Logo } from "@/components/Logo";
import { colors, spacing, typography } from "@/constants/theme";

const ONBOARDING_KEY = "gibrid_razryad_onboarding_seen";

const STEPS = [
  {
    title: "МОБИЛЬНАЯ\nЭЛЕКТРОЗАПРАВКА\nНОВОГО ПОКОЛЕНИЯ",
    subtitle: "Заряжайте электромобиль там, где вам удобно — без поездок на станцию.",
    icon: "battery-charging" as const,
  },
  {
    title: "МЫ ПРИЕДЕМ\nК ВАМ",
    subtitle: "Зарядим быстро и безопасно, пока вы занимаетесь своими делами.",
    icon: "map-pin" as const,
  },
  {
    title: "ЭНЕРГИЯ\nДВИЖЕТ БУДУЩЕЕ",
    subtitle: "Экологичная мобильная зарядка — часть сети «Гибрид» по всей стране.",
    icon: "globe" as const,
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  async function finish() {
    await AsyncStorage.setItem(ONBOARDING_KEY, "1");
    router.replace("/(auth)/login");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#111C36", colors.bg]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      />

      <View style={styles.topRow}>
        {step > 0 ? (
          <Pressable style={styles.backBtn} onPress={() => setStep((s) => s - 1)} hitSlop={10}>
            <Feather name="chevron-left" size={22} color={colors.textPrimary} />
          </Pressable>
        ) : (
          <View style={styles.backBtn} />
        )}
        {!isLast ? (
          <Pressable onPress={finish} hitSlop={10}>
            <Text style={styles.skip}>Пропустить</Text>
          </Pressable>
        ) : (
          <View />
        )}
      </View>

      <View style={styles.artWrap}>
        <View style={styles.artCircle}>
          <Feather name={current.icon} size={56} color={colors.accent} />
        </View>
        <Logo size={0} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>
      </View>

      <View style={styles.bottom}>
        <Dots count={STEPS.length} activeIndex={step} />
        <Button
          label={isLast ? "Начать" : "Далее"}
          onPress={() => (isLast ? finish() : setStep((s) => s + 1))}
          style={{ marginTop: spacing.xl, alignSelf: "stretch" }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  skip: {
    ...typography.body,
    color: colors.textSecondary,
  },
  artWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  artCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  content: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 34,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.md,
  },
  bottom: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: "center",
  },
});
