import React, { useState } from "react";
import { View, StyleSheet, Platform } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import { PressableCard } from "../atoms/PressableCard";
import { Typography } from "../atoms/Typography";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState<"start" | "end">("start");

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    if (Platform.OS === "android") setShow(false); // Sembunyikan setelah pilih di Android

    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      if (mode === "start") {
        onChange(formattedDate, endDate);
      } else {
        onChange(startDate, formattedDate);
      }
    }
  };

  const showPicker = (target: "start" | "end") => {
    setMode(target);
    setShow(true);
  };

  const currentDate = new Date(mode === "start" ? startDate : endDate);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Tombol Tanggal Mulai */}
        <PressableCard
          onPress={() => showPicker("start")}
          style={styles.dateBtn}
        >
          <Calendar size={18} color="#FF9500" />
          <View style={styles.labelGroup}>
            <Typography variant="caption" style={styles.label}>
              Mulai
            </Typography>
            <Typography variant="body" style={styles.dateText}>
              {startDate}
            </Typography>
          </View>
        </PressableCard>

        <View style={styles.divider} />

        {/* Tombol Tanggal Selesai */}
        <PressableCard onPress={() => showPicker("end")} style={styles.dateBtn}>
          <Calendar size={18} color="#FF9500" />
          <View style={styles.labelGroup}>
            <Typography variant="caption" style={styles.label}>
              Selesai
            </Typography>
            <Typography variant="body" style={styles.dateText}>
              {endDate}
            </Typography>
          </View>
        </PressableCard>
      </View>

      {show && (
        <DateTimePicker
          value={currentDate}
          mode="date"
          display={Platform.OS === "ios" ? "inline" : "default"}
          onChange={handleDateChange}
          // Batasi agar end date tidak sebelum start date
          minimumDate={mode === "end" ? new Date(startDate) : undefined}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  dateBtn: { flex: 1, padding: 12, marginBottom: 0, gap: 10 },
  labelGroup: { flex: 1 },
  label: { color: "#8E8E93", marginBottom: 2 },
  dateText: { fontSize: 13, fontWeight: "600" },
  divider: { height: 1, width: 8, backgroundColor: "#D1D1D6" },
});
