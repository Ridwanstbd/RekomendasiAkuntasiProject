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
  ActivityIndicator,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: LucideIcon;
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  icon: Icon,
  isLoading = false,
  disabled,
  ...rest
}) => {
  const loaderColor = variant === "outline" ? "#007AFF" : "#FFFFFF";

  return (
    <TouchableOpacity
      style={[
        styles.base,
        styles[variant],
        (disabled || isLoading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || isLoading}
      {...rest}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator size="small" color={loaderColor} />
        ) : (
          <>
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
          </>
        )}
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
    minHeight: 54,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  primary: { backgroundColor: "#007AFF" },
  secondary: { backgroundColor: "#E5E5EA" },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  textBase: { fontSize: 16, fontWeight: "600" },
  textPrimary: { color: "#FFFFFF" },
  textSecondary: { color: "#3A3A3C" },
  textOutline: { color: "#007AFF" },
});
