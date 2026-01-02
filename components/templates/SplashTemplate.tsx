import React from "react";
import { View, StyleSheet, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../atoms/Typography";
import { Box } from "lucide-react-native";

interface SplashTemplateProps {
  fadeAnim: any;
  scaleAnim: any;
  brandName: string;
  version: string;
}

export const SplashTemplate: React.FC<SplashTemplateProps> = ({
  fadeAnim,
  scaleAnim,
  brandName,
  version,
}) => (
  <SafeAreaView style={styles.container}>
    <Animated.View
      style={[
        styles.content,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.logoWrapper}>
        <Box size={80} color="#007AFF" strokeWidth={1.5} />
      </View>
      <Typography variant="h1" style={styles.brandName}>
        {brandName}
      </Typography>
    </Animated.View>
    <View style={styles.footer}>
      <Typography variant="caption" color="#CCC">
        {version}
      </Typography>
    </View>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: { alignItems: "center", justifyContent: "center" },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  brandName: { letterSpacing: 4, marginBottom: 8 },
  footer: { position: "absolute", bottom: 40 },
});
