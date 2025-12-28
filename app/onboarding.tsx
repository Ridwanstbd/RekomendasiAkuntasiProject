import React, { useState, useRef } from "react";
import { View, StyleSheet, FlatList, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Rocket, ShieldCheck, Smartphone } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../components/atoms/Typography";
import { Button } from "../components/atoms/Button";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "Cepat & Responsif",
    desc: "Nikmati performa aplikasi yang luar biasa cepat untuk menunjang produktivitas Anda.",
    icon: Rocket,
    color: "#007AFF",
  },
  {
    id: "2",
    title: "Keamanan Data",
    desc: "Privasi Anda adalah prioritas kami dengan enkripsi data tingkat lanjut.",
    icon: ShieldCheck,
    color: "#28a745",
  },
  {
    id: "3",
    title: "Akses Fleksibel",
    desc: "Kelola semua kebutuhan Anda langsung dari genggaman tangan di mana saja.",
    icon: Smartphone,
    color: "#FF9500",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/(auth)/login");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: `${item.color}15` },
              ]}
            >
              <item.icon size={80} color={item.color} strokeWidth={1.5} />
            </View>
            <Typography variant="h1" style={styles.title}>
              {item.title}
            </Typography>
            <Typography variant="body" style={styles.desc}>
              {item.desc}
            </Typography>
          </View>
        )}
      />

      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, currentIndex === i && styles.activeDot]}
            />
          ))}
        </View>

        <Button
          title={
            currentIndex === SLIDES.length - 1 ? "Mulai Sekarang" : "Lanjut"
          }
          onPress={handleNext}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  slide: { width, justifyContent: "center", alignItems: "center", padding: 40 },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  title: { textAlign: "center", marginBottom: 16 },
  desc: { textAlign: "center", color: "#666" },
  footer: { padding: 24, paddingBottom: 40 },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#DDD",
    marginHorizontal: 4,
  },
  activeDot: { width: 24, backgroundColor: "#007AFF" },
});
