import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Logo } from "@/components/Logo";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";

const ONBOARDING_KEY = "gibrid_razryad_onboarding_seen";
const MIN_SPLASH_MS = 1100;

export default function SplashScreen() {
  const router = useRouter();
  const initializing = useAuthStore((s) => s.initializing);
  const session = useAuthStore((s) => s.session);
  const fade = useRef(new Animated.Value(0)).current;
  const navigatedRef = useRef(false);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [fade]);

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();

    async function decideRoute() {
      if (initializing) return;
      const elapsed = Date.now() - startedAt;
      const wait = Math.max(0, MIN_SPLASH_MS - elapsed);
      await new Promise((resolve) => setTimeout(resolve, wait));
      if (cancelled || navigatedRef.current) return;

      const seenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
      navigatedRef.current = true;

      if (session) {
        router.replace("/(app)/(tabs)/home");
      } else if (seenOnboarding) {
        router.replace("/(auth)/login");
      } else {
        router.replace("/onboarding");
      }
    }

    decideRoute();
    return () => {
      cancelled = true;
    };
  }, [initializing, session, router]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0F1B33", colors.bg]}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      />
      <Animated.View style={{ opacity: fade, alignItems: "center" }}>
        <Logo size={84} withWordmark />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
});
