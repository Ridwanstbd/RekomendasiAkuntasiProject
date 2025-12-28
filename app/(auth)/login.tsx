import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LogIn } from "lucide-react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from "../../components/atoms/Typography";
import { FormField } from "../../components/molecules/FormField";
import { Button } from "../../components/atoms/Button";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();

  const handleLogin = () => {
    if (!email || !password) {
      setError("Email dan password wajib diisi!");
    } else {
      setError(undefined);
      router.replace("/(tabs)/explore");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Typography variant="h1">Selamat Datang</Typography>
          <Typography variant="body" color="#666">
            Silakan masuk ke akun Anda
          </Typography>
        </View>

        <View style={styles.form}>
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
            style={{ marginTop: 12 }}
          />
        </View>

        <View style={styles.footer}>
          <Typography variant="body">Belum punya akun? </Typography>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Typography
              variant="body"
              color="#007AFF"
              style={{ fontWeight: "600" }}
            >
              Daftar
            </Typography>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  content: { flex: 1, padding: 24, justifyContent: "center" },
  header: { marginBottom: 32 },
  form: { gap: 4 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 32 },
});
