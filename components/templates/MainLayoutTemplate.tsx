import React from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  StyleProp,
  ViewStyle,
  View,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface MainLayoutTemplateProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  refreshing?: boolean;
  style?: StyleProp<ViewStyle>;
  isScrollable?: boolean;
}

export const MainLayoutTemplate = ({
  children,
  onRefresh,
  refreshing = false,
  style,
  isScrollable = true,
}: MainLayoutTemplateProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {isScrollable ? (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[styles.content, style]}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flexContainer, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7", // Warna latar belakang terang
  },
  scrollView: {
    flex: 1,
  },
  flexContainer: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
});
