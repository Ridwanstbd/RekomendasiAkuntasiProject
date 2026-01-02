import { Tabs } from "expo-router";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  PieChart,
  User,
} from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF", // Warna biru aktif
        tabBarInactiveTintColor: "#8E8E93", // Warna abu-abu inaktif
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          height: 65,
          paddingBottom: 25,
          paddingTop: 8,
          marginBottom: 12,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        options={{
          title: "Catat",
          tabBarIcon: ({ color, size }) => (
            <PlusCircle color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Transaksi",
          tabBarIcon: ({ color, size }) => (
            <History color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="reports"
        options={{
          title: "Laporan",
          tabBarIcon: ({ color, size }) => (
            <PieChart color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
