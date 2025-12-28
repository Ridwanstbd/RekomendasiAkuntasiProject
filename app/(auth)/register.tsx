import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { UserPlus, ArrowLeft } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Typography } from "../../components/atoms/Typography";
import { FormField } from "../../components/molecules/FormField";
import { Button } from "../../components/atoms/Button";

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Typography variant="h1">Daftar Akun</Typography>
          <Typography variant="body" color="#666">
            Lengkapi data untuk bergabung
          </Typography>
        </View>

        <View style={styles.form}>
          <FormField
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            value={name}
            onChangeText={setName}
          />
          <FormField
            label="Email"
            placeholder="nama@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          <FormField
            label="Password"
            placeholder="Minimal 8 karakter"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title="Buat Akun"
            variant="primary"
            icon={UserPlus}
            onPress={() => router.replace("/(tabs)/explore")}
            style={{ marginTop: 12 }}
          />
        </View>

        <View style={styles.footer}>
          <Typography variant="body">Sudah punya akun? </Typography>
          <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
            <Typography
              variant="body"
              color="#007AFF"
              style={{ fontWeight: "600" }}
            >
              Login
            </Typography>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  content: { padding: 24 },
  backBtn: { marginBottom: 24, marginTop: 10 },
  header: { marginBottom: 32 },
  form: { gap: 4 },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 32 },
});
