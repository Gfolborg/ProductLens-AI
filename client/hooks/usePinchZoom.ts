/**
 * 🔍 usePinchZoom Hook
 * Reusable hook for pinch-to-zoom and pan gestures
 * Use for: Image viewers, photo galleries, maps
 */

import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Gesture } from 'react-native-gesture-handler';
import { smoothSpring } from '@/lib/animations';

export interface PinchZoomConfig {
  minScale?: number;      // Minimum zoom level (default 1)
  maxScale?: number;      // Maximum zoom level (default 3)
  doubleTapScale?: number; // Scale on double tap (default 2)
  onZoomStart?: () => void;
  onZoomEnd?: () => void;
}

export function usePinchZoom({
  minScale = 1,
  maxScale = 3,
  doubleTapScale = 2,
  onZoomStart,
  onZoomEnd,
}: PinchZoomConfig = {}) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  // Pinch gesture for zooming
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      if (onZoomStart) {
        onZoomStart();
      }
    })
    .onUpdate((event) => {
      // Calculate new scale
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(Math.max(newScale, minScale), maxScale);

      // Store focal point
      focalX.value = event.focalX;
      focalY.value = event.focalY;
    })
    .onEnd(() => {
      savedScale.value = scale.value;

      // If zoomed out too much, snap back to min scale
      if (scale.value < minScale) {
        scale.value = withSpring(minScale, smoothSpring);
        savedScale.value = minScale;
      }

      if (onZoomEnd) {
        onZoomEnd();
      }
    });

  // Pan gesture for dragging when zoomed
  const panGesture = Gesture.Pan()
    .enabled(scale.value > 1)
    .onUpdate((event) => {
      // Only allow panning when zoomed in
      if (savedScale.value > 1) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
      }
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  // Double tap gesture to zoom in/out
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((event) => {
      if (scale.value > 1) {
        // Zoom out
        scale.value = withSpring(minScale, smoothSpring);
        savedScale.value = minScale;
        translateX.value = withSpring(0, smoothSpring);
        translateY.value = withSpring(0, smoothSpring);
        savedTranslateX.value = 0;
        savedTranslateY.value = 0;
      } else {
        // Zoom in
        scale.value = withSpring(doubleTapScale, smoothSpring);
        savedScale.value = doubleTapScale;

        // Center on tap position
        const centerX = -event.x * (doubleTapScale - 1);
        const centerY = -event.y * (doubleTapScale - 1);
        translateX.value = withSpring(centerX, smoothSpring);
        translateY.value = withSpring(centerY, smoothSpring);
        savedTranslateX.value = centerX;
        savedTranslateY.value = centerY;
      }
    });

  // Combine gestures
  const composedGesture = Gesture.Simultaneous(
    pinchGesture,
    panGesture,
    doubleTapGesture
  );

  // Reset to initial state
  const reset = () => {
    scale.value = withTiming(1);
    savedScale.value = 1;
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  return {
    composedGesture,
    scale,
    translateX,
    translateY,
    reset,
    isZoomed: scale.value > 1,
  };
}
