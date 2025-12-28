import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Input } from "../atoms/Input";
import { Typography } from "../atoms/Typography";

interface FormFieldProps extends React.ComponentProps<typeof Input> {}

export const FormField: React.FC<FormFieldProps> = ({ error, ...props }) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(shakeAnimation, {
            toValue: 10,
            duration: 45,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnimation, {
            toValue: -10,
            duration: 45,
            useNativeDriver: true,
          }),
          Animated.timing(shakeAnimation, {
            toValue: 0,
            duration: 45,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
        <Input error={error} {...props} />
      </Animated.View>

      {error && (
        <Typography
          variant="caption"
          color="#FF3B30"
          style={[styles.errorText, { opacity: opacityAnimation as any }]}
        >
          {error}
        </Typography>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: "100%", marginBottom: 8 },
  errorText: { marginTop: -8, marginBottom: 12, marginLeft: 4 },
});
