/**
 * 👆 useSwipeGesture Hook
 * Reusable hook for swipe-to-action gestures
 * Use for: Swipe-to-delete, swipe-to-archive, etc.
 */

import { useSharedValue } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';

export interface SwipeGestureConfig {
  threshold?: number;           // Distance to trigger action (default 120)
  direction?: 'left' | 'right'; // Swipe direction (default 'left')
  onSwipeComplete?: () => void; // Callback when swipe completes
  enabled?: boolean;            // Enable/disable gesture (default true)
}

export function useSwipeGesture({
  threshold = 120,
  direction = 'left',
  onSwipeComplete,
  enabled = true,
}: SwipeGestureConfig) {
  const translateX = useSharedValue(0);
  const startX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  const panGesture = Gesture.Pan()
    .enabled(enabled)
    .onStart(() => {
      isDragging.value = true;
      startX.value = translateX.value;
    })
    .onUpdate((event) => {
      // Calculate new position based on direction
      const newTranslateX = startX.value + event.translationX;

      if (direction === 'left') {
        // Only allow negative translation (swipe left)
        translateX.value = Math.min(0, newTranslateX);
      } else {
        // Only allow positive translation (swipe right)
        translateX.value = Math.max(0, newTranslateX);
      }
    })
    .onEnd((event) => {
      isDragging.value = false;

      const velocity = direction === 'left' ? event.velocityX : -event.velocityX;
      const distance = Math.abs(translateX.value);

      // Check if swipe threshold is met
      if (distance >= threshold || velocity < -500) {
        // Swipe completed - trigger action
        if (onSwipeComplete) {
          onSwipeComplete();
        }
      } else {
        // Swipe not far enough - snap back
        translateX.value = 0;
      }
    });

  return {
    panGesture,
    translateX,
    isDragging,
  };
}
