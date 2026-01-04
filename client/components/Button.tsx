import React, { ReactNode, useEffect } from "react";
import { StyleSheet, Pressable, ViewStyle, StyleProp, View, ActivityIndicator } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  WithSpringConfig,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { BorderRadius, Spacing, Shadows, Colors } from "@/constants/theme";
import { smoothSpring, buttonPress } from "@/lib/animations";

interface ButtonProps {
  onPress?: () => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  textStyle?: StyleProp<any>;
  variant?: "primary" | "secondary" | "outline" | "glow";
  loading?: boolean;
  success?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const springConfig: WithSpringConfig = {
  damping: 15,
  mass: 0.3,
  stiffness: 150,
  overshootClamping: true,
  energyThreshold: 0.001,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Button({
  onPress,
  children,
  style,
  disabled = false,
  textStyle,
  variant = "primary",
  loading = false,
  success = false,
  icon,
  iconPosition = "left",
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glowScale = useSharedValue(1);

  // Glow pulse animation
  useEffect(() => {
    if (variant === "glow" && !disabled && !loading) {
      glowScale.value = withRepeat(
        withSequence(
          withSpring(1.05, smoothSpring),
          withSpring(1, smoothSpring)
        ),
        -1,
        false
      );
    } else {
      glowScale.value = withSpring(1, smoothSpring);
    }
  }, [variant, disabled, loading]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled && !loading) {
      // Stronger press for glow variant
      const pressScale = variant === "glow" ? buttonPress.scaleEnergetic : buttonPress.scaleNormal;
      const pressRotation = variant === "glow" ? buttonPress.rotation : 0;

      scale.value = withSpring(pressScale, springConfig);
      opacity.value = withSpring(buttonPress.opacityNormal, springConfig);
      rotation.value = withSpring(pressRotation, springConfig);
    }
  };

  const handlePressOut = () => {
    if (!disabled && !loading) {
      scale.value = withSpring(1, springConfig);
      opacity.value = withSpring(1, springConfig);
      rotation.value = withSpring(0, springConfig);
    }
  };

  const isStringChild = typeof children === "string";

  const getButtonContent = () => {
    // Loading state
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            color={variant === "outline" ? theme.primary : theme.buttonText}
            size="small"
          />
          {isStringChild && (
            <ThemedText
              type="body"
              style={[
                styles.buttonText,
                { color: variant === "outline" ? theme.primary : theme.buttonText, marginLeft: Spacing.sm },
                textStyle,
              ]}
            >
              {children}
            </ThemedText>
          )}
        </View>
      );
    }

    // Success state
    if (success) {
      return (
        <View style={styles.iconTextContainer}>
          <ThemedText style={styles.successIcon}>✓</ThemedText>
          {isStringChild && (
            <ThemedText
              type="body"
              style={[
                styles.buttonText,
                { color: variant === "outline" ? theme.primary : theme.buttonText },
                textStyle,
              ]}
            >
              {children}
            </ThemedText>
          )}
        </View>
      );
    }

    // Icon + Text
    if (icon && isStringChild) {
      return (
        <View style={styles.iconTextContainer}>
          {iconPosition === "left" && icon}
          <ThemedText
            type="body"
            style={[
              styles.buttonText,
              {
                color: variant === "outline" ? theme.primary : theme.buttonText,
                marginLeft: iconPosition === "left" ? Spacing.sm : 0,
                marginRight: iconPosition === "right" ? Spacing.sm : 0,
              },
              textStyle,
            ]}
          >
            {children}
          </ThemedText>
          {iconPosition === "right" && icon}
        </View>
      );
    }

    // Default content
    const content = isStringChild ? (
      <ThemedText
        type="body"
        style={[
          styles.buttonText,
          {
            color: variant === "outline" ? theme.primary : theme.buttonText,
          },
          textStyle,
        ]}
      >
        {children}
      </ThemedText>
    ) : (
      <View style={styles.childContainer}>{children}</View>
    );

    if (variant === "primary") {
      return (
        <LinearGradient
          colors={[theme.gradients.heroStart, theme.gradients.heroMiddle, theme.gradients.heroEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradientButton, style]}
        >
          {content}
        </LinearGradient>
      );
    }

    if (variant === "secondary") {
      return (
        <View
          style={[
            styles.solidButton,
            {
              backgroundColor: theme.backgroundCard,
            },
            style,
          ]}
        >
          {content}
        </View>
      );
    }

    // Outline variant
    if (variant === "outline") {
      return (
        <View
          style={[
            styles.outlineButton,
            {
              borderColor: theme.primary,
              backgroundColor: "transparent",
            },
            style,
          ]}
        >
          {content}
        </View>
      );
    }

    // Glow variant - dramatic with pulsing colored shadow
    if (variant === "glow") {
      return (
        <Animated.View style={animatedGlowStyle}>
          <LinearGradient
            colors={[theme.gradients.heroStart, theme.gradients.heroMiddle, theme.gradients.heroEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.glowButton, style]}
          >
            {content}
          </LinearGradient>
        </Animated.View>
      );
    }

    // Default to content wrapped in View
    return <>{content}</>;
  };

  // Default accessibility label from children if it's a string
  const defaultAccessibilityLabel = typeof children === "string" ? children : undefined;

  return (
    <AnimatedPressable
      onPress={disabled || loading ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.button,
        variant === "glow" && styles.glowButtonContainer,
        disabled && styles.disabled,
        animatedStyle,
      ]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || defaultAccessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled: disabled || loading,
        busy: loading,
      }}
    >
      {getButtonContent()}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    ...Shadows.md,
  },
  gradientButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  solidButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    ...Shadows.sm,
  },
  outlineButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
    borderWidth: 2,
  },
  glowButtonContainer: {
    ...Shadows.electric,
  },
  glowButton: {
    height: Spacing.buttonHeight,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  disabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  childContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  iconTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.xs,
  },
  successIcon: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.white,
  },
});
