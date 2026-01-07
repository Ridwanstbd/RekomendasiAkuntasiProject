import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Lock, Save } from "lucide-react-native";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { HeroFormTemplate } from "@/components/organisms/HeroFormTemplate";
import { Typography } from "@/components/atoms/Typography";
import api from "@/services/api";

export default function ChangePasswordScreen() {
  const router = useRouter();

  // States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    // 1. Validasi Client-side
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Semua kolom wajib diisi!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Kata sandi baru minimal 6 karakter!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok!");
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      // 2. Hitung API
      await api.post("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });

      // 3. Feedback Sukses
      Alert.alert("Berhasil", "Kata sandi Anda telah diperbarui.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Gagal memperbarui kata sandi";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeroFormTemplate showTab={false}>
      <Typography variant="h2" style={styles.title}>
        Ganti Kata Sandi
      </Typography>
      <Typography variant="body" style={styles.subtitle}>
        Pastikan kata sandi baru Anda kuat dan sulit ditebak.
      </Typography>

      <FormField
        label="Kata Sandi Saat Ini"
        placeholder="Masukkan kata sandi lama"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        secureTextEntry
        error={error && currentPassword === "" ? error : undefined}
      />

      <FormField
        label="Kata Sandi Baru"
        placeholder="Minimal 6 karakter"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <FormField
        label="Konfirmasi Kata Sandi Baru"
        placeholder="Ulangi kata sandi baru"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        error={error} // Menampilkan error utama di sini
      />

      <Button
        title="Simpan Perubahan"
        icon={Save}
        onPress={handleUpdatePassword}
        isLoading={loading}
        style={{ marginTop: 20 }}
      />
    </HeroFormTemplate>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 4,
    textAlign: "left",
  },
  subtitle: {
    color: "#8E8E93",
    marginBottom: 24,
    fontSize: 14,
  },
});
