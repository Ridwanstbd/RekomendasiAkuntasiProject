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
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          height: 65,
          paddingBottom: 25,
          paddingTop: 8,
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

      {/* 1. Ubah nama rute menjadi create/index */}
      <Tabs.Screen
        name="create/index"
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
      <Tabs.Screen
        name="transactions/[id]"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="transactions/edit"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="create/form"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="reports/profit-loss"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="reports/ledger"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="reports/balance-sheet"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="reports/export"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="custom-recommendations"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="recommendations"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="change-password"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
