import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface ProgressBarProps {
  current: number;
  total: number;
  animated?: boolean;
}

export function ProgressBar({ current, total, animated = true }: ProgressBarProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const percentage = total > 0 ? (current / total) * 100 : 0;
    if (animated) {
      progress.value = withSpring(percentage, {
        damping: 15,
        stiffness: 100,
      });
    } else {
      progress.value = percentage;
    }
  }, [current, total, animated, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View style={styles.container}>
      <ThemedText type="small" style={styles.label}>
        Processing {current} of {total}
      </ThemedText>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, animatedStyle]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    marginBottom: Spacing.xs,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  track: {
    height: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.xs,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.xs,
  },
});
