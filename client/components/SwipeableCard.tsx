/**
 * 👉 SwipeableCard Component
 * Card with swipe-to-delete/archive functionality
 * Use for: Image thumbnails, list items, batch selections
 */

import React, { ReactNode } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import { ThemedText } from '@/components/ThemedText';
import { useTheme } from '@/hooks/useTheme';
import { useSwipeGesture, SwipeGestureConfig } from '@/hooks/useSwipeGesture';
import { BorderRadius, Spacing } from '@/constants/theme';
import { smoothSpring } from '@/lib/animations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SwipeableCardProps extends SwipeGestureConfig {
  children: ReactNode;
  onDelete?: () => void;
  onArchive?: () => void;
  deleteText?: string;
  archiveText?: string;
  deleteColor?: string;
  archiveColor?: string;
  style?: any;
}

// Memoized to prevent re-renders in lists/grids
export const SwipeableCard = React.memo(({
  children,
  onDelete,
  onArchive,
  deleteText = '🗑️ Delete',
  archiveText = '📥 Archive',
  deleteColor,
  archiveColor,
  threshold = 120,
  direction = 'left',
  enabled = true,
  style,
}: SwipeableCardProps) => {
  const { theme } = useTheme();

  const handleSwipeComplete = () => {
    // Trigger haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    // Call appropriate callback
    if (direction === 'left' && onDelete) {
      onDelete();
    } else if (direction === 'right' && onArchive) {
      onArchive();
    }
  };

  const { panGesture, translateX, isDragging } = useSwipeGesture({
    threshold,
    direction,
    onSwipeComplete: handleSwipeComplete,
    enabled,
  });

  const cardStyle = useAnimatedStyle(() => {
    // Smooth spring animation when dragging
    const animatedTranslateX = isDragging.value
      ? translateX.value
      : withSpring(translateX.value, smoothSpring);

    // Slight rotation based on drag distance
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-5, 0, 5]
    );

    return {
      transform: [
        { translateX: animatedTranslateX },
        { rotate: `${rotation}deg` },
      ],
    };
  });

  const deleteZoneStyle = useAnimatedStyle(() => {
    // Fade in delete zone as card is swiped
    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, threshold / 2, threshold],
      [0, 0.5, 1]
    );

    return {
      opacity,
    };
  });

  const deleteIconStyle = useAnimatedStyle(() => {
    // Scale up icon as approaching threshold
    const scale = interpolate(
      Math.abs(translateX.value),
      [0, threshold / 2, threshold],
      [0.5, 0.8, 1.2]
    );

    return {
      transform: [{ scale }],
    };
  });

  return (
    <View style={[styles.container, style]}>
      {/* Background Action Zone (Delete/Archive) */}
      <Animated.View
        style={[
          styles.actionZone,
          {
            backgroundColor: direction === 'left'
              ? (deleteColor || theme.error)
              : (archiveColor || theme.emerald),
            alignItems: direction === 'left' ? 'flex-end' : 'flex-start',
          },
          deleteZoneStyle,
        ]}
      >
        <Animated.View style={[styles.actionContent, deleteIconStyle]}>
          <ThemedText style={styles.actionText}>
            {direction === 'left' ? deleteText : archiveText}
          </ThemedText>
        </Animated.View>
      </Animated.View>

      {/* Swipeable Card */}
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: BorderRadius.xl,
  },
  actionZone: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  actionContent: {
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  card: {
    backgroundColor: 'transparent',
  },
});
