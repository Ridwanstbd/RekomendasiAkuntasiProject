import React from "react";
import { View, StyleSheet } from "react-native";
import { PaginationBar } from "../molecules/PaginationBar";
import { Button } from "../atoms/Button";

interface OnboardingFooterProps {
  totalSlides: number;
  currentIndex: number;
  onNext: () => void;
}

export const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  totalSlides,
  currentIndex,
  onNext,
}) => (
  <View style={styles.footer}>
    <PaginationBar total={totalSlides} currentIndex={currentIndex} />
    <Button
      title={currentIndex === totalSlides - 1 ? "Mulai Sekarang" : "Lanjut"}
      onPress={onNext}
    />
  </View>
);

const styles = StyleSheet.create({
  footer: { padding: 24, paddingBottom: 40 },
});
