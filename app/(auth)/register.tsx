import React, { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { UserPlus } from "lucide-react-native";
import * as SecureStore from "expo-secure-store";
import { FormField } from "../../components/molecules/FormField";
import { Button } from "../../components/atoms/Button";
import { HeroFormTemplate } from "@/components/organisms/HeroFormTemplate";
import api from "@/services/api";

export default function RegisterScreen() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleRegister = async () => {
    if (!username || !firstName || !lastName || !email || !password || !phone) {
      setError("Semua field harus terisi!");
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      await api.post("/api/auth/register", {
        username,
        email,
        password,
        profile: {
          firstName,
          lastName,
          phone,
        },
      });

      const loginResponse = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (loginResponse.data.token) {
        await SecureStore.setItemAsync("userToken", loginResponse.data.token);

        Alert.alert(
          "Registrasi Berhasil",
          "Akun Anda telah dibuat dan Anda otomatis masuk.",
          [
            {
              text: "Lanjutkan",
              onPress: () => router.replace("/(tabs)/dashboard"),
            },
          ]
        );
      } else {
        router.replace("/(auth)/login");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Gagal mendaftarkan akun";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeroFormTemplate showTab={true}>
      <FormField
        label="Nama Pengguna"
        placeholder="ridwanstbd"
        value={username}
        onChangeText={setUsername}
      />

      <FormField
        label="Nama Depan"
        placeholder="Ridwan"
        value={firstName}
        onChangeText={setFirstName}
      />

      <FormField
        label="Nama Belakang"
        placeholder="Setio Budi"
        value={lastName}
        onChangeText={setLastName}
      />

      <FormField
        label="Nomor Telepon"
        type="number"
        placeholder="0812..."
        value={phone}
        onChangeText={setPhone}
      />

      <FormField
        label="Email"
        placeholder="nama@email.com"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        error={error}
      />

      <FormField
        label="Password"
        placeholder="Minimal 8 karakter"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        type="password"
      />

      <Button
        title={loading ? "Mendaftarkan..." : "Buat Akun"}
        variant="primary"
        icon={!loading ? UserPlus : undefined}
        onPress={handleRegister}
        style={{ marginTop: 12 }}
        isLoading={loading}
      />
    </HeroFormTemplate>
  );
}
