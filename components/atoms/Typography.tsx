import React from "react";
import { Animated, TextStyle, StyleSheet, StyleProp } from "react-native";

interface TypographyProps {
  // Tambahkan "h3" ke dalam daftar variant yang diizinkan
  variant: "h1" | "h2" | "h3" | "body" | "caption";
  children: React.ReactNode;
  color?: string;
  style?: StyleProp<TextStyle>;
}

export const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  color,
  style,
}) => {
  return (
    <Animated.Text style={[styles[variant], color ? { color } : {}, style]}>
      {children}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: "bold", color: "#1A1A1A" },
  h2: { fontSize: 24, fontWeight: "700", color: "#1A1A1A" },
  // Tambahkan gaya untuk h3 (ukuran di antara h2 dan body)
  h3: { fontSize: 20, fontWeight: "700", color: "#1A1A1A" },
  body: { fontSize: 16, fontWeight: "400", color: "#4A4A4A" },
  caption: { fontSize: 12, fontWeight: "400", color: "#8E8E93" },
});
