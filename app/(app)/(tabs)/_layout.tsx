import React from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { View, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { colors } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarShowLabel: true,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarStyle: {
          backgroundColor: Platform.OS === "ios" ? "transparent" : colors.bgElevated,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 62,
          paddingTop: 6,
          paddingBottom: 10,
          position: Platform.OS === "ios" ? "absolute" : undefined,
        },
        tabBarBackground:
          Platform.OS === "ios"
            ? () => (
                <BlurView
                  tint="dark"
                  intensity={60}
                  style={{ ...require("react-native").StyleSheet.absoluteFillObject, backgroundColor: "rgba(10,10,15,0.85)" }}
                />
              )
            : undefined,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Главная",
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "История",
          tabBarIcon: ({ color, size }) => <Feather name="clock" color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="cars"
        options={{
          title: "Авто",
          tabBarIcon: ({ color, size }) => <Feather name="zap" color={color} size={size ?? 22} />,
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: "Поддержка",
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" color={color} size={size ?? 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Профиль",
          tabBarIcon: ({ color, size }) => <Feather name="user" color={color} size={size ?? 22} />,
        }}
      />
    </Tabs>
  );
}
