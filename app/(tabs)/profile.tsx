import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Alert, Image } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import {
  User,
  Users,
  ShieldCheck,
  LogOut,
  UserPlus,
  Building,
} from "lucide-react-native";

import { MainLayoutTemplate } from "@/components/templates/MainLayoutTemplate";
import { Typography } from "@/components/atoms/Typography";
import { Card } from "@/components/atoms/Card";
import { Badge } from "@/components/atoms/Badge";
import { Loader } from "@/components/atoms/Loader";
import { PressableCard } from "@/components/atoms/PressableCard";
import { InfoRow } from "@/components/molecules/InfoRow";
import { OwnerData, StaffUser } from "@/types/accounting";
import api from "@/services/api";

export default function ProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState<OwnerData | null>(null);
  const [staff, setStaff] = useState<StaffUser[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [meRes, staffRes] = await Promise.all([
        api.get("/api/auth/me"),
        api.get("/api/users?limit=5"), // Mengambil daftar staff
      ]);
      setOwner(meRes.data.data);
      setStaff(staffRes.data.users);
    } catch (err) {
      console.error("Gagal mengambil data profil:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Apakah Anda yakin ingin keluar?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Keluar",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("userToken");
          await SecureStore.deleteItemAsync("businessId");
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  if (loading && !owner) return <Loader />;

  return (
    <MainLayoutTemplate onRefresh={fetchData}>
      {/* 1. Header Profil */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Typography variant="h1" style={{ color: "#FFF" }}>
            {owner?.profile.firstName[0]}
            {owner?.profile.lastName[0]}
          </Typography>
        </View>
        <Typography variant="h1" style={styles.name}>
          {owner?.name}
        </Typography>
        <Typography variant="body" style={styles.email}>
          {owner?.email}
        </Typography>
        <Badge label="Business Owner" color="#5856D6" />
      </View>

      {/* 2. Informasi Bisnis */}
      <Typography variant="h2" style={styles.sectionTitle}>
        Bisnis Anda
      </Typography>
      {owner?.businesses.map((biz) => (
        <Card key={biz.id} style={styles.bizCard}>
          <Building size={20} color="#007AFF" />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Typography variant="body" style={{ fontWeight: "700" }}>
              {biz.name}
            </Typography>
            <Typography
              variant="body"
              style={{ fontSize: 12, color: "#8E8E93" }}
            >
              ID: {biz.code}
            </Typography>
          </View>
          <Badge label={biz.role} color="#34C759" />
        </Card>
      ))}

      {/* 3. Manajemen Staf (Professional Accountant) */}
      {/* <View style={styles.sectionHeader}>
        <Typography variant="h2">Tim Akuntan</Typography>
        <PressableCard 
          onPress={() => Alert.alert("Invite", "Menuju halaman undang staf")} 
          style={styles.inviteBtn}
        >
          <UserPlus size={16} color="#FFF" />
          <Typography variant="body" style={styles.inviteText}>Undang</Typography>
        </PressableCard>
      </View> */}
      {/* 
      <Card>
        {staff.length > 0 ? (
          staff.map((s) => (
            <View key={s.id} style={styles.staffRow}>
              <View style={styles.staffInfo}>
                <Typography variant="body" style={{ fontWeight: "600" }}>
                  {s.profile.firstName} {s.profile.lastName}
                </Typography>
                <Typography variant="body" style={{ fontSize: 12, color: "#8E8E93" }}>{s.email}</Typography>
              </View>
              <Badge label="Accountant" color="#007AFF" />
            </View>
          ))
        ) : (
          <Typography variant="body" style={styles.emptyText}>Belum ada staf terdaftar.</Typography>
        )}
      </Card> */}

      {/* 4. Pengaturan Akun */}
      <Typography variant="h2" style={styles.sectionTitle}>
        Keamanan & Akun
      </Typography>
      <Card style={{ padding: 0 }}>
        <PressableCard
          onPress={() => router.push("/change-password")}
          style={styles.menuItem}
        >
          <ShieldCheck size={20} color="#8E8E93" />
          <Typography variant="body" style={styles.menuLabel}>
            Ganti Kata Sandi
          </Typography>
        </PressableCard>

        <PressableCard
          onPress={handleLogout}
          style={[styles.menuItem, { borderBottomWidth: 0 }]}
        >
          <LogOut size={20} color="#FF3B30" />
          <Typography
            variant="body"
            style={[styles.menuLabel, { color: "#FF3B30" }]}
          >
            Keluar Aplikasi
          </Typography>
        </PressableCard>
      </Card>

      <View style={{ height: 40 }} />
    </MainLayoutTemplate>
  );
}

const styles = StyleSheet.create({
  header: { alignItems: "center", marginVertical: 24 },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: { fontSize: 24, fontWeight: "800" },
  email: { color: "#8E8E93", marginBottom: 8 },
  sectionTitle: { fontSize: 18, marginTop: 24, marginBottom: 12 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  bizCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 12,
  },
  staffRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  staffInfo: { flex: 1 },
  inviteBtn: {
    backgroundColor: "#1C1C1E",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: "row",
    gap: 6,
    marginBottom: 0,
    borderWidth: 0,
  },
  inviteText: { color: "#FFF", fontSize: 12, fontWeight: "700" },
  menuItem: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    marginBottom: 0,
    borderRadius: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  menuLabel: { fontWeight: "600" },
  emptyText: { textAlign: "center", color: "#8E8E93", paddingVertical: 20 },
});
