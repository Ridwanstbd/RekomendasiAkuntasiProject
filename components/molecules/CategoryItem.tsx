import React from "react";
import { View, StyleSheet } from "react-native";
import { LucideIcon, ChevronRight } from "lucide-react-native";
import { Typography } from "../atoms/Typography";
import { PressableCard } from "../atoms/PressableCard";

interface CategoryItemProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onPress: () => void;
}

export const CategoryItem: React.FC<CategoryItemProps> = ({
  title,
  description,
  icon: Icon,
  color,
  onPress,
}) => {
  return (
    <PressableCard onPress={onPress}>
      <View style={[styles.iconWrapper, { backgroundColor: `${color}15` }]}>
        <Icon color={color} size={24} />
      </View>
      <View style={styles.content}>
        <Typography variant="body" style={styles.title}>
          {title}
        </Typography>
        <Typography variant="body" style={styles.description}>
          {description}
        </Typography>
      </View>
      <ChevronRight color="#C7C7CC" size={20} />
    </PressableCard>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontWeight: "600",
    color: "#1C1C1E",
  },
  description: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
});
