import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Typography } from "../atoms/Typography";
import { Bell } from "lucide-react-native";

interface HeaderProps {
  name: string;
}

export const Header: React.FC<HeaderProps> = ({ name }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>
      <View style={styles.content}>
        <View>
          <Typography variant="body" color="#8E8E93">
            Selamat Datang,
          </Typography>
          <Typography variant="h2" style={styles.name}>
            {name}
          </Typography>
        </View>
        <View style={styles.iconCircle}>
          <Bell size={20} color="#1C1C1E" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
});
