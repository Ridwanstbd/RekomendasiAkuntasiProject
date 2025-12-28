import { LucideIcon } from "lucide-react-native";
import React from "react";
import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  View,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: LucideIcon;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  icon: Icon,
  ...rest
}) => {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], style]}
      onPress={onPress}
      activeOpacity={0.7}
      {...rest}
    >
      <View style={styles.content}>
        {Icon && (
          <Icon
            size={18}
            color={variant === "outline" ? "#007AFF" : "#FFF"}
            strokeWidth={2.5}
            style={{ marginRight: 8 }}
          />
        )}

        <Text
          style={[
            styles.textBase,
            styles[
              `text${
                variant.charAt(0).toUpperCase() + variant.slice(1)
              }` as keyof typeof styles
            ],
            textStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 8,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: "#007AFF",
  },
  secondary: {
    backgroundColor: "#E5E5EA",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  textBase: {
    fontSize: 16,
    fontWeight: "600",
  },
  textPrimary: {
    color: "#FFFFFF",
  },
  textSecondary: {
    color: "#3A3A3C",
  },
  textOutline: {
    color: "#007AFF",
  },
});
