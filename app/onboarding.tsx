import React, { useState, useRef } from "react";
import {
  Image,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../components/atoms/Typography";
import { Button } from "../components/atoms/Button";

const { width } = Dimensions.get("window");

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

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace("/(auth)/login");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/background.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
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
              <Image
                source={item.image}
                style={styles.imageIllustration}
                resizeMode="contain"
              />
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  slide: { width, justifyContent: "center", alignItems: "center", padding: 40 },
  imageIllustration: {
    width: 280,
    height: 280,
    marginBottom: 40,
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  title: { textAlign: "center", marginBottom: 16, color: "#FFFFFF" },
  desc: { textAlign: "center", color: "#dcdbdbff" },
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
