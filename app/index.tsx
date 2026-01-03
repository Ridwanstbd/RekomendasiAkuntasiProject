import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { SplashTemplate } from "@/components/templates/SplashTemplate";

export default function SplashScreen() {
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const checkStatus = async () => {
      const hasSeenOnboarding = await SecureStore.getItemAsync(
        "hasSeenOnboarding"
      );

      const userToken = await SecureStore.getItemAsync("userToken");

      setTimeout(() => {
        if (hasSeenOnboarding === "true") {
          router.replace("/(auth)/login");
        } else if (userToken) {
          router.replace("/(tabs)/dashboard");
        } else {
          router.replace("/onboarding");
        }
      }, 4000);
    };

    checkStatus();
  }, []);

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

    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SplashTemplate
      fadeAnim={fadeAnim}
      scaleAnim={scaleAnim}
      brandName="ACCOUNTING APP"
      version="v1.0.0"
    />
  );
}
