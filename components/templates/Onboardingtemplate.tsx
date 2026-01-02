import React from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Dimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OnboardingSlide } from "../molecules/OnboardingSlide";
import { OnboardingFooter } from "../organisms/OnboardingFooter";

const { width } = Dimensions.get("window");

interface OnboardingTemplateProps {
  slides: any[];
  currentIndex: number;
  flatListRef: React.RefObject<FlatList<any> | null>;
  onScrollEnd: (index: number) => void;
  onNext: () => void;
}

export const OnboardingTemplate: React.FC<OnboardingTemplateProps> = ({
  slides,
  currentIndex,
  flatListRef,
  onScrollEnd,
  onNext,
}) => {
  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            onScrollEnd(Math.round(e.nativeEvent.contentOffset.x / width));
          }}
          renderItem={({ item }) => <OnboardingSlide item={item} />}
        />

        <OnboardingFooter
          totalSlides={slides.length}
          currentIndex={currentIndex}
          onNext={onNext}
        />
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: { flex: 1 },
  container: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
});
