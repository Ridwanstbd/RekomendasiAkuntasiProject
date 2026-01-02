import React from "react";
import { ScrollView, StyleSheet, View, RefreshControl } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface MainLayoutTemplateProps {
  children: React.ReactNode;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  backgroundColor?: string;
}

export const MainLayoutTemplate: React.FC<MainLayoutTemplateProps> = ({
  children,
  isRefreshing = false,
  onRefresh,
  backgroundColor = "#FFF",
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 10 },
        { backgroundColor },
      ]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
});
