import React from "react";
import { Animated, TextStyle, StyleSheet, StyleProp } from "react-native";

interface TypographyProps {
  variant: "h1" | "h2" | "body" | "caption";
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
  body: { fontSize: 16, fontWeight: "400", color: "#4A4A4A" },
  caption: { fontSize: 12, fontWeight: "400", color: "#8E8E93" },
});
