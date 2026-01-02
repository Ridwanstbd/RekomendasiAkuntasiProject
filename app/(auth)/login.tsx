import React, { useState } from "react";

import { useRouter } from "expo-router";
import { LogIn } from "lucide-react-native";
import { FormField } from "../../components/molecules/FormField";
import { Button } from "../../components/atoms/Button";
import { HeroFormTemplate } from "@/components/organisms/HeroFormTemplate";
import * as SecureStore from "expo-secure-store";
import api from "@/services/api";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi!");
      return;
    }
    setLoading(true);
    setError(undefined);

    try {
      const response = await api.post("/api/auth/login", { email, password });

      await SecureStore.setItemAsync("userToken", response.data.accessToken);
      router.replace("/(tabs)/dashboard");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Terjadi Kesalahan saat login";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HeroFormTemplate showTab={true}>
      <FormField
        label="Email"
        placeholder="Masukkan email"
        value={email}
        onChangeText={setEmail}
        error={error}
        autoCapitalize="none"
      />
      <FormField
        label="Password"
        placeholder="Masukkan password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button
        title="Masuk"
        icon={LogIn}
        onPress={handleLogin}
        isLoading={loading}
        style={{ marginTop: 12 }}
      />
    </HeroFormTemplate>
  );
}
