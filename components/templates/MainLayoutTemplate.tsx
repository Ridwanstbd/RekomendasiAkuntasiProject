import React from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  StyleProp,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MainLayoutTemplateProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  // Tambahkan properti style di sini
  style?: StyleProp<ViewStyle>;
}

export const MainLayoutTemplate = ({
  children,
  onRefresh,
  refreshing = false,
  style, // Destruktur properti style
}: MainLayoutTemplateProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        // Terapkan style ke contentContainerStyle agar padding bekerja dengan benar pada ScrollView
        contentContainerStyle={[styles.content, style]}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
});
