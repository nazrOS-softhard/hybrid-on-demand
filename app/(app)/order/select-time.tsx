import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Button } from "@/components/Button";
import { colors, radius, spacing, typography } from "@/constants/theme";
import { useOrderStore } from "@/store/orderStore";

const WEEKDAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTHS = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const TIME_SLOTS = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

export default function SelectTime() {
  const router = useRouter();
  const setSchedule = useOrderStore((s) => s.setSchedule);

  const days = useMemo(() => {
    const arr = [];
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const [dayIndex, setDayIndex] = useState(0);
  const [time, setTime] = useState<string | null>(null);

  const selectedDay = days[dayIndex];
  const dateLabel = `${selectedDay.getDate()} ${MONTHS[selectedDay.getMonth()]}`;

  function handleContinue() {
    if (!time) return;
    setSchedule(dateLabel, time);
    router.push("/(app)/order/select-tariff");
  }

  return (
    <ScreenContainer scroll={false} padded={false}>
      <Header title="Когда удобно?" />
      <View style={styles.content}>
        <View style={styles.daysRow}>
          {days.map((d, i) => {
            const selected = i === dayIndex;
            return (
              <Pressable key={d.toISOString()} onPress={() => setDayIndex(i)} style={[styles.dayCell, selected && styles.dayCellActive]}>
                <Text style={[styles.dayWeekday, selected && styles.dayTextActive]}>{WEEKDAYS[d.getDay()]}</Text>
                <Text style={[styles.dayNumber, selected && styles.dayTextActive]}>{d.getDate()}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Выберите время</Text>
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((slot) => {
            const selected = slot === time;
            return (
              <Pressable key={slot} onPress={() => setTime(slot)} style={[styles.timeChip, selected && styles.timeChipActive]}>
                <Text style={[styles.timeText, selected && styles.timeTextActive]}>{slot}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Button label="Продолжить" onPress={handleContinue} disabled={!time} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: spacing.lg },
  daysRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.xl },
  dayCell: {
    width: 44,
    height: 60,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  dayCellActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  dayWeekday: { ...typography.small, color: colors.textSecondary },
  dayNumber: { ...typography.bodyMedium, color: colors.textPrimary },
  dayTextActive: { color: "#fff" },
  sectionTitle: { ...typography.caption, color: colors.textSecondary, marginBottom: spacing.md },
  timeGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  timeChip: {
    width: "31%",
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  timeChipActive: { backgroundColor: colors.accentSoft, borderColor: colors.accent },
  timeText: { ...typography.body, color: colors.textPrimary },
  timeTextActive: { color: colors.accent, fontWeight: "700" },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
});
