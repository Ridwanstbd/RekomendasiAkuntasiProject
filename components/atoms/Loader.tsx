import { ActivityIndicator, StyleSheet, View } from "react-native";

export const Loader = () => {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
};
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
