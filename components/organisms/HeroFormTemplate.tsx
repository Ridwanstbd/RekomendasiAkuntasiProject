import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../atoms/Typography";
import { useRouter, usePathname } from "expo-router";

const { height } = Dimensions.get("window");

interface HeroFormTemplateProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showTab?: boolean;
}

export const HeroFormTemplate: React.FC<HeroFormTemplateProps> = ({
  children,
  title = "Mulai Sekarang",
  subtitle = "Buat Akun atau Masuk untuk pantau keuanganmu.",
  showTab = false,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname.includes("login");

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.safeArea}>
            <ScrollView
              bounces={false}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled" // Memastikan klik tombol tetap berfungsi saat keyboard aktif
            >
              <View style={styles.header}>
                <Typography variant="h1" color="#FFF" style={styles.title}>
                  {title}
                </Typography>
                <Typography variant="body" color="#EEE" style={styles.subtitle}>
                  {subtitle}
                </Typography>
              </View>

              <View style={styles.card}>
                {showTab && (
                  <View style={styles.tabContainer}>
                    <TouchableOpacity
                      style={[styles.tab, isLogin && styles.activeTab]}
                      onPress={() => router.replace("/(auth)/login")}
                    >
                      <Typography
                        variant="body"
                        style={[
                          styles.tabText,
                          isLogin && styles.activeTabText,
                        ]}
                      >
                        Masuk
                      </Typography>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.tab, !isLogin && styles.activeTab]}
                      onPress={() => router.replace("/(auth)/register")}
                    >
                      <Typography
                        variant="body"
                        style={[
                          styles.tabText,
                          !isLogin && styles.activeTabText,
                        ]}
                      >
                        Daftar
                      </Typography>
                    </TouchableOpacity>
                  </View>
                )}

                <View style={styles.formContent}>{children}</View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  header: { paddingHorizontal: 24, paddingVertical: 40 }, // Dikurangi sedikit agar lebih pas saat keyboard muncul
  title: { fontSize: 32, marginBottom: 8 },
  subtitle: { fontSize: 14, opacity: 0.8 },
  card: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32, // Tambahan padding bawah
    minHeight: height * 0.5,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center", borderRadius: 8 },
  activeTab: {
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontWeight: "500", color: "#8E8E93" },
  activeTabText: { color: "#1C1C1E" },
  formContent: { flex: 1 },
});
