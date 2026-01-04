/**
 * 🎯 AnimatedProgress Component
 * Progress bar with milestone celebrations and emojis
 * Use for batch processing, uploads, or any progress tracking!
 */

import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useDerivedValue,
  SharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { ParticleSystem } from '@/components/ParticleSystem';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, Spacing } from '@/constants/theme';
import { smoothSpring } from '@/lib/animations';

interface AnimatedProgressProps {
  progress: number;              // 0-100
  height?: number;               // Default 12
  showPercentage?: boolean;      // Default true
  showMilestones?: boolean;      // Default true
  celebrateMilestones?: boolean; // Default true
  gradient?: string[];           // Custom gradient colors
}

const MILESTONES = [25, 50, 75, 100];

export function AnimatedProgress({
  progress,
  height = 12,
  showPercentage = true,
  showMilestones = true,
  celebrateMilestones = true,
  gradient,
}: AnimatedProgressProps) {
  const { theme } = useTheme();
  const [celebratedMilestones, setCelebratedMilestones] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  const progressValue = useSharedValue(0);

  // Default gradient - energy gradient
  const progressGradient = gradient || [
    theme.gradients.energyStart,
    theme.gradients.energyMiddle,
    theme.gradients.energyEnd,
  ];

  useEffect(() => {
    // Animate progress
    progressValue.value = withSpring(progress, smoothSpring);

    // Check for milestone celebrations
    if (celebrateMilestones) {
      const currentMilestone = MILESTONES.find(
        m => progress >= m && !celebratedMilestones.has(m)
      );

      if (currentMilestone) {
        setCelebratedMilestones(prev => new Set(prev).add(currentMilestone));
        setShowConfetti(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        // Hide confetti after animation
        setTimeout(() => setShowConfetti(false), 2500);
      }
    }
  }, [progress, celebrateMilestones]);

  const animatedWidth = useAnimatedStyle(() => ({
    width: `${progressValue.value}%`,
  }));

  const animatedPercentage = useDerivedValue(() => {
    return Math.floor(progressValue.value);
  });

  // Get emoji based on progress
  const getProgressEmoji = () => {
    if (progress >= 100) return '✨';
    if (progress >= 75) return '🚀';
    if (progress >= 50) return '🔥';
    if (progress >= 25) return '🎨';
    return '⏳';
  };

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel="Processing progress"
      accessibilityValue={{ min: 0, max: 100, now: Math.floor(progress) }}
      accessibilityLiveRegion="polite"
    >
      {/* Progress bar */}
      <View style={[styles.track, { height, borderRadius: height / 2 }]}>
        <Animated.View style={[styles.progressContainer, animatedWidth]}>
          <LinearGradient
            colors={progressGradient as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progress, { height, borderRadius: height / 2 }]}
          />
        </Animated.View>

        {/* Milestone markers */}
        {showMilestones && MILESTONES.slice(0, -1).map((milestone) => (
          <View
            key={milestone}
            style={[
              styles.milestone,
              {
                left: `${milestone}%`,
                backgroundColor: celebratedMilestones.has(milestone)
                  ? theme.emerald
                  : theme.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Percentage and emoji */}
      {showPercentage && (
        <View style={styles.labelContainer}>
          <ThemedText style={styles.emoji}>{getProgressEmoji()}</ThemedText>
          <AnimatedPercentageText value={animatedPercentage} />
        </View>
      )}

      {/* Confetti celebration */}
      {showConfetti && (
        <ParticleSystem
          particleCount={30}
          duration={2500}
          hapticFeedback={false}
        />
      )}
    </View>
  );
}

interface AnimatedPercentageTextProps {
  value: SharedValue<number>;
}

// Memoized to prevent unnecessary re-renders
const AnimatedPercentageText = React.memo(({ value }: AnimatedPercentageTextProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setDisplayValue(Math.floor(value.value));
    }, 33); // ~30fps - smooth enough for percentage display

    return () => clearInterval(id);
  }, [value]);

  return (
    <ThemedText type="body" style={styles.percentage}>
      {displayValue}%
    </ThemedText>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  track: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressContainer: {
    height: '100%',
  },
  progress: {
    width: '100%',
  },
  milestone: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: '50%',
    marginTop: -2,
    marginLeft: -2,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  emoji: {
    fontSize: 20,
  },
  percentage: {
    fontWeight: '700',
    fontSize: 16,
  },
});
