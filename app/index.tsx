import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Box } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../components/atoms/Typography";

export default function SplashScreen() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Berikan jeda 2.5 detik sebelum pindah ke Onboarding
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        {/* Logo Section */}
        <View style={styles.logoWrapper}>
          <Box size={80} color="#007AFF" strokeWidth={1.5} />
        </View>

        {/* Brand Name */}
        <Typography variant="h1" style={styles.brandName}>
          NEXUS APP
        </Typography>

        {/* Subtitle / Version */}
        <Typography variant="caption" color="#999">
          Build with React Expo & Atomic Design
        </Typography>
      </Animated.View>

      {/* Loading Indicator Bawah (Opsional) */}
      <View style={styles.footer}>
        <Typography variant="caption" color="#CCC">
          v1.0.0
        </Typography>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 30,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  brandName: {
    letterSpacing: 4,
    marginBottom: 8,
  },
  footer: {
    position: "absolute",
    bottom: 40,
  },
});
