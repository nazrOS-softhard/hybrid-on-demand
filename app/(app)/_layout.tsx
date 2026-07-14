import React from "react";
import { Redirect, Stack } from "expo-router";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";

export default function AppLayout() {
  const session = useAuthStore((s) => s.session);
  const initializing = useAuthStore((s) => s.initializing);

  if (!initializing && !session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="(tabs)" />

      <Stack.Screen name="order/select-car" />
      <Stack.Screen name="order/select-address" />
      <Stack.Screen name="order/select-time" />
      <Stack.Screen name="order/select-tariff" />
      <Stack.Screen name="order/confirm" />
      <Stack.Screen name="order/waiting" options={{ gestureEnabled: false }} />
      <Stack.Screen name="order/charging" options={{ gestureEnabled: false }} />
      <Stack.Screen name="order/complete" options={{ gestureEnabled: false }} />

      <Stack.Screen name="cars/add" options={{ presentation: "modal" }} />

      <Stack.Screen name="profile/edit" />
      <Stack.Screen name="profile/payment-methods" />
      <Stack.Screen name="profile/add-payment" options={{ presentation: "modal" }} />
      <Stack.Screen name="profile/settings" />
    </Stack>
  );
}
