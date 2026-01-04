/**
 * 🎊 ParticleSystem Component
 * Creates confetti and celebration particle effects
 * Use for success states, milestones, and fun moments!
 */

import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import {
  particlePhysics,
  getRandomConfettiColor,
  randomBetween,
} from '@/lib/animations';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  rotation: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
  size: number;
}

interface ParticleSystemProps {
  particleCount?: number;
  duration?: number;
  colors?: string[];
  origin?: { x: number; y: number };
  onComplete?: () => void;
  hapticFeedback?: boolean;
}

export function ParticleSystem({
  particleCount = 40,
  duration = particlePhysics.lifetime,
  colors,
  origin = { x: SCREEN_WIDTH / 2, y: SCREEN_HEIGHT / 3 },
  onComplete,
  hapticFeedback = true,
}: ParticleSystemProps) {
  // Generate particles once on mount
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: `particle-${i}`,
      x: origin.x,
      y: origin.y,
      color: colors ? colors[i % colors.length] : getRandomConfettiColor(),
      rotation: randomBetween(0, 360),
      velocityX: randomBetween(
        -particlePhysics.horizontalSpread * 10,
        particlePhysics.horizontalSpread * 10
      ),
      velocityY: randomBetween(
        particlePhysics.initialVelocityMin,
        particlePhysics.initialVelocityMax
      ),
      rotationSpeed: randomBetween(-particlePhysics.rotationSpeed * 10, particlePhysics.rotationSpeed * 10),
      size: randomBetween(6, 12),
    }));
  }, [particleCount, colors, origin.x, origin.y]);

  // Trigger haptic feedback on mount
  useEffect(() => {
    if (hapticFeedback) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }

    // Call onComplete after animation finishes
    if (onComplete) {
      const timeout = setTimeout(onComplete, duration);
      return () => clearTimeout(timeout);
    }
  }, [hapticFeedback, duration, onComplete]);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <ParticleItem
          key={particle.id}
          particle={particle}
          duration={duration}
        />
      ))}
    </View>
  );
}

interface ParticleItemProps {
  particle: Particle;
  duration: number;
}

// Memoized to prevent re-renders when parent updates
const ParticleItem = React.memo(({ particle, duration }: ParticleItemProps) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(particle.rotation);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    // Physics simulation using timing animation
    const frames = 60; // 60 FPS
    const frameTime = 1000 / frames;
    const totalFrames = Math.floor(duration / frameTime);

    // Animate position with physics
    const targetX = particle.velocityX * (duration / 100);
    const targetY = particle.velocityY * (duration / 100) +
                   (particlePhysics.gravity * duration * duration) / 20000;

    translateX.value = withTiming(targetX, {
      duration,
      easing: Easing.linear,
    });

    translateY.value = withTiming(targetY, {
      duration,
      easing: Easing.out(Easing.quad),
    });

    // Rotate continuously
    rotation.value = withTiming(
      particle.rotation + (particle.rotationSpeed * duration) / 10,
      {
        duration,
        easing: Easing.linear,
      }
    );

    // Fade out near the end
    const fadeStart = duration * particlePhysics.fadeOutStart;
    opacity.value = withSequence(
      withTiming(1, { duration: fadeStart }),
      withTiming(0, { duration: duration - fadeStart, easing: Easing.out(Easing.cubic) })
    );

    // Slight scale variation for depth
    scale.value = withSequence(
      withTiming(1.2, { duration: duration * 0.3, easing: Easing.out(Easing.quad) }),
      withTiming(0.8, { duration: duration * 0.7, easing: Easing.in(Easing.quad) })
    );
  }, [duration, particle]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: particle.color,
          width: particle.size,
          height: particle.size,
          left: particle.x,
          top: particle.y,
        },
        animatedStyle,
      ]}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  particle: {
    position: 'absolute',
    borderRadius: 2,
  },
});
