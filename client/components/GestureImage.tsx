/**
 * 🖼️ GestureImage Component
 * Image with pinch-to-zoom and pan gestures
 * Use for: Photo viewers, result previews, image galleries
 */

import React, { useState } from 'react';
import { View, StyleSheet, Image, ImageSourcePropType, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
} from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';

import { usePinchZoom, PinchZoomConfig } from '@/hooks/usePinchZoom';
import { BorderRadius } from '@/constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface GestureImageProps extends PinchZoomConfig {
  source: ImageSourcePropType | { uri: string };
  width?: number;
  height?: number;
  borderRadius?: number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  style?: any;
  accessibilityLabel?: string;
}

export function GestureImage({
  source,
  width = SCREEN_WIDTH * 0.9,
  height = SCREEN_WIDTH * 0.9,
  borderRadius = BorderRadius.lg,
  resizeMode = 'contain',
  minScale = 1,
  maxScale = 3,
  doubleTapScale = 2,
  onZoomStart,
  onZoomEnd,
  style,
  accessibilityLabel = 'Image',
}: GestureImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const [zoomPercentage, setZoomPercentage] = useState(100);

  const {
    composedGesture,
    scale,
    translateX,
    translateY,
  } = usePinchZoom({
    minScale,
    maxScale,
    doubleTapScale,
    onZoomStart,
    onZoomEnd,
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  // Monitor zoom level for indicator (optimized with useEffect)
  React.useEffect(() => {
    const interval = setInterval(() => {
      const currentScale = scale.value;
      const shouldShow = currentScale > 1.1;
      setShowZoomIndicator(shouldShow);
      if (shouldShow) {
        setZoomPercentage(Math.round(currentScale * 100));
      }
    }, 100); // 10fps is enough for zoom indicator

    return () => clearInterval(interval);
  }, [scale]);

  return (
    <View
      style={[styles.container, { width, height, borderRadius }, style]}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint="Double tap to zoom, pinch to scale, drag to pan when zoomed"
    >
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image
            source={source}
            style={[
              styles.image,
              {
                width,
                height,
                borderRadius,
              },
            ]}
            resizeMode={resizeMode}
            onLoadEnd={() => setImageLoaded(true)}
            accessible={false}
          />
        </Animated.View>
      </GestureDetector>

      {/* Zoom indicator */}
      {showZoomIndicator && (
        <View
          style={styles.zoomIndicator}
          accessibilityLiveRegion="polite"
          accessibilityLabel={`Zoomed to ${zoomPercentage} percent`}
        >
          <Animated.Text style={styles.zoomText}>
            {zoomPercentage}%
          </Animated.Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  zoomIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  zoomText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
