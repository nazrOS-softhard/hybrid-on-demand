// Единая система дизайн-токенов приложения «Гибрид Разряд».
// Тёмная тема, синий/бирюзовый градиентный акцент — в точности как на макете.

export const colors = {
  bg: "#0A0A0F",
  bgElevated: "#101017",
  card: "#15151D",
  cardAlt: "#1B1B24",
  border: "#24242E",
  borderLight: "#2E2E3A",

  textPrimary: "#F5F6FA",
  textSecondary: "#8B8B9B",
  textMuted: "#5B5B68",

  accent: "#3B82F6",
  accentSoft: "rgba(59, 130, 246, 0.14)",
  accentGradient: ["#4F8CFF", "#38D6FF"] as const,

  success: "#34D399",
  successSoft: "rgba(52, 211, 153, 0.12)",
  warning: "#FBBF24",
  danger: "#F86363",
  dangerSoft: "rgba(248, 99, 99, 0.12)",

  white: "#FFFFFF",
  black: "#000000",
  overlay: "rgba(6, 6, 10, 0.72)",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 36,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: "700" as const, letterSpacing: -0.4 },
  h2: { fontSize: 22, fontWeight: "700" as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: "600" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  bodyMedium: { fontSize: 15, fontWeight: "600" as const },
  caption: { fontSize: 13, fontWeight: "400" as const },
  small: { fontSize: 11, fontWeight: "500" as const },
};

export const shadow = {
  card: {
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
  },
};
