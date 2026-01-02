import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import { Typography } from "../atoms/Typography";

const { width } = Dimensions.get("window");

interface OnboardingSlideProps {
  item: {
    title: string;
    desc: string;
    image: any;
  };
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ item }) => (
  <View style={styles.slide}>
    <Image
      source={item.image}
      style={styles.imageIllustration}
      resizeMode="contain"
    />
    <Typography variant="h1" style={styles.title}>
      {item.title}
    </Typography>
    <Typography variant="body" style={styles.desc}>
      {item.desc}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  slide: { width, justifyContent: "center", alignItems: "center", padding: 40 },
  imageIllustration: { width: 280, height: 280, marginBottom: 40 },
  title: { textAlign: "center", marginBottom: 16, color: "#FFFFFF" },
  desc: { textAlign: "center", color: "#dcdbdbff" },
});
