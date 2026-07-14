import React, { useState } from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/ScreenContainer";
import { Header } from "@/components/Header";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { colors, spacing, typography } from "@/constants/theme";
import { useCars } from "@/hooks/useCars";

export default function AddCar() {
  const router = useRouter();
  const { addCar } = useCars();
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [batteryPercent, setBatteryPercent] = useState("78");
  const [rangeKm, setRangeKm] = useState("312");
  const [isPrimary, setIsPrimary] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!brand || !model) {
      setError("Укажите марку и модель автомобиля");
      return;
    }
    setError(null);
    setLoading(true);
    const { error: addError } = await addCar({
      brand: brand.trim(),
      model: model.trim(),
      plate_number: plateNumber.trim() || null,
      battery_percent: clampPercent(Number(batteryPercent) || 0),
      range_km: Math.max(0, Number(rangeKm) || 0),
      color: null,
      connector_type: "Type 2 (CCS)",
      is_primary: isPrimary,
    });
    setLoading(false);
    if (addError) {
      setError(addError);
      return;
    }
    router.back();
  }

  return (
    <ScreenContainer>
      <Header title="Новый автомобиль" />
      <Input label="Марка" placeholder="HYBRID" value={brand} onChangeText={setBrand} />
      <Input label="Модель" placeholder="Model X" value={model} onChangeText={setModel} />
      <Input
        label="Гос. номер (необязательно)"
        placeholder="А123БВ 777"
        autoCapitalize="characters"
        value={plateNumber}
        onChangeText={setPlateNumber}
      />
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Input
            label="Заряд, %"
            keyboardType="number-pad"
            value={batteryPercent}
            onChangeText={setBatteryPercent}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Input label="Запас хода, км" keyboardType="number-pad" value={rangeKm} onChangeText={setRangeKm} />
        </View>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Сделать основным автомобилем</Text>
        <Switch
          value={isPrimary}
          onValueChange={setIsPrimary}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor="#fff"
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button label="Сохранить автомобиль" onPress={handleSubmit} loading={loading} style={{ marginTop: spacing.lg }} />
    </ScreenContainer>
  );
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, value));
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.md },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  switchLabel: { ...typography.body, color: colors.textPrimary, flex: 1, marginRight: spacing.md },
  error: { ...typography.caption, color: colors.danger, marginBottom: spacing.sm },
});
