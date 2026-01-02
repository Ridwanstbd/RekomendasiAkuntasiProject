import React, { useState, useRef } from "react";
import { FlatList, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { OnboardingTemplate } from "@/components/templates/Onboardingtemplate";

const SLIDES = [
  {
    id: "1",
    title: "Catat Transaksi Mudah",
    desc: "Nikmati performa aplikasi yang luar biasa cepat untuk menunjang produktivitas Anda.",
    image: require("../assets/icons/add_notes.png"),
  },
  {
    id: "2",
    title: "Laporan Real Time",
    desc: "Privasi Anda adalah prioritas kami dengan enkripsi data tingkat lanjut.",
    image: require("../assets/icons/monitor.png"),
  },
  {
    id: "3",
    title: "Kendali Bisnis Lebih Mudah",
    desc: "Kelola semua kebutuhan Anda langsung dari genggaman tangan di mana saja.",
    image: require("../assets/icons/statistics_illustration.png"),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await SecureStore.setItemAsync("hasSeenOnboarding", "true");
      router.replace("/(auth)/login");
    }
  };

  return (
    <OnboardingTemplate
      slides={SLIDES}
      currentIndex={currentIndex}
      flatListRef={flatListRef}
      onScrollEnd={setCurrentIndex}
      onNext={handleNext}
    />
  );
}
