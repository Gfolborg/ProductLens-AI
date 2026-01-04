import React, { useEffect } from "react";
import { StyleSheet, Pressable, ViewStyle, View, Platform } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { ThemedText } from "@/components/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { smoothSpring, cardInteraction, shimmer } from "@/lib/animations";

interface CardProps {
  elevation?: number;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  variant?: "default" | "glass" | "elevated";
  loading?: boolean;
  shadowColor?: "electric" | "coral" | "emerald" | "sunset";
}


const getBackgroundColorForElevation = (
  elevation: number,
  theme: any,
): string => {
  switch (elevation) {
    case 1:
      return theme.backgroundDefault;
    case 2:
      return theme.backgroundSecondary;
    case 3:
      return theme.backgroundTertiary;
    default:
      return theme.backgroundRoot;
  }
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Card({
  elevation = 1,
  title,
  description,
  children,
  onPress,
  style,
  variant = "default",
  loading = false,
  shadowColor,
}: CardProps) {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const shimmerTranslate = useSharedValue(-shimmer.translateDistance);

  const cardBackgroundColor = getBackgroundColorForElevation(elevation, theme);

  // Shimmer animation for loading state
  useEffect(() => {
    if (loading) {
      shimmerTranslate.value = withRepeat(
        withTiming(shimmer.translateDistance, {
          duration: shimmer.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      );
    } else {
      shimmerTranslate.value = -shimmer.translateDistance;
    }
  }, [loading]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { perspective: 1000 },
      { rotateX: `${rotateX.value}deg` },
      { rotateY: `${rotateY.value}deg` },
    ],
  }));

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslate.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(cardInteraction.scalePress, smoothSpring);

    // Add 3D tilt effect
    if (variant === "elevated" || variant === "glass") {
      rotateX.value = withSpring(cardInteraction.tiltAmount / 2, smoothSpring);
      rotateY.value = withSpring(-cardInteraction.tiltAmount / 2, smoothSpring);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, smoothSpring);
    rotateX.value = withSpring(0, smoothSpring);
    rotateY.value = withSpring(0, smoothSpring);
  };

  // Get shadow style based on shadowColor prop
  const shadowStyle = shadowColor ? Shadows[shadowColor] : Shadows.md;

  // Glass variant - frosted glass with blur effect
  if (variant === "glass") {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.card, styles.glassCard, animatedStyle, style]}
      >
        {Platform.OS !== "web" && (
          <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
        )}
        <View style={styles.glassContent}>
          <LinearGradient
            colors={[theme.glassBorder, 'transparent', theme.glassBorder]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.glassBorder}
          />
          {renderContent()}
        </View>
        {loading && renderShimmer()}
      </AnimatedPressable>
    );
  }

  // Elevated variant - dramatic shadows and depth
  if (variant === "elevated") {
    return (
      <AnimatedPressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          styles.elevatedCard,
          shadowStyle,
          { backgroundColor: cardBackgroundColor },
          animatedStyle,
          style,
        ]}
      >
        {renderContent()}
        {loading && renderShimmer()}
      </AnimatedPressable>
    );
  }

  // Default variant
  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.card,
        { backgroundColor: cardBackgroundColor },
        animatedStyle,
        style,
      ]}
    >
      {renderContent()}
      {loading && renderShimmer()}
    </AnimatedPressable>
  );

  function renderContent() {
    return (
      <>
        {title ? (
          <ThemedText type="h4" style={styles.cardTitle}>
            {title}
          </ThemedText>
        ) : null}
        {description ? (
          <ThemedText type="small" style={styles.cardDescription}>
            {description}
          </ThemedText>
        ) : null}
        {children}
      </>
    );
  }

  function renderShimmer() {
    return (
      <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} pointerEvents="none">
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.shimmerGradient}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    padding: Spacing.xl,
    borderRadius: BorderRadius["2xl"],
    overflow: 'hidden',
  },
  glassCard: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  glassContent: {
    position: 'relative',
  },
  glassBorder: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: BorderRadius["2xl"],
    opacity: 0.5,
  },
  elevatedCard: {
    ...Shadows.lg,
  },
  cardTitle: {
    marginBottom: Spacing.sm,
  },
  cardDescription: {
    opacity: 0.7,
  },
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
    width: '200%',
  },
  shimmerGradient: {
    flex: 1,
    opacity: shimmer.opacity,
  },
});
