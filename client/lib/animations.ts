/**
 * 🎬 Shared Animation Configurations
 * Reusable animation configs for React Native Reanimated
 */

import { WithSpringConfig, WithTimingConfig, Easing } from 'react-native-reanimated';

// ⚡ Spring Configurations

/**
 * Energetic spring - High energy, bouncy feel
 * Use for: Success celebrations, playful interactions
 */
export const energeticSpring: WithSpringConfig = {
  damping: 12,
  stiffness: 180,
  mass: 0.5,
  overshootClamping: false,
};

/**
 * Bouncy spring - Extra bounce for fun
 * Use for: Button presses, card interactions
 */
export const bouncySpring: WithSpringConfig = {
  damping: 10,
  stiffness: 200,
  mass: 0.3,
  overshootClamping: false,
};

/**
 * Smooth spring - Gentle, refined motion
 * Use for: Screen transitions, subtle animations
 */
export const smoothSpring: WithSpringConfig = {
  damping: 15,
  stiffness: 150,
  mass: 0.4,
  overshootClamping: true,
};

/**
 * Snappy spring - Quick and responsive
 * Use for: Immediate feedback, gestures
 */
export const snappySpring: WithSpringConfig = {
  damping: 18,
  stiffness: 300,
  mass: 0.2,
  overshootClamping: true,
};

/**
 * Elastic spring - Maximum bounce
 * Use for: Dramatic entrances, celebrations
 */
export const elasticSpring: WithSpringConfig = {
  damping: 8,
  stiffness: 150,
  mass: 0.6,
  overshootClamping: false,
};

// ⏱️ Timing Configurations

/**
 * Quick timing - Fast animations (200ms)
 * Use for: Micro-interactions, button presses
 */
export const quickTiming: WithTimingConfig = {
  duration: 200,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

/**
 * Normal timing - Standard animations (400ms)
 * Use for: Most UI transitions
 */
export const normalTiming: WithTimingConfig = {
  duration: 400,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

/**
 * Slow timing - Deliberate animations (600ms)
 * Use for: Screen transitions, dramatic effects
 */
export const slowTiming: WithTimingConfig = {
  duration: 600,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

/**
 * Linear timing - Constant speed
 * Use for: Looping animations, progress indicators
 */
export const linearTiming: WithTimingConfig = {
  duration: 1000,
  easing: Easing.linear,
};

/**
 * Ease out timing - Deceleration
 * Use for: Entrance animations
 */
export const easeOutTiming: WithTimingConfig = {
  duration: 400,
  easing: Easing.out(Easing.cubic),
};

/**
 * Ease in timing - Acceleration
 * Use for: Exit animations
 */
export const easeInTiming: WithTimingConfig = {
  duration: 400,
  easing: Easing.in(Easing.cubic),
};

// 🎆 Particle Physics Constants

/**
 * Particle physics settings for confetti
 */
export const particlePhysics = {
  gravity: 0.5,              // Downward acceleration
  initialVelocityMin: -8,    // Minimum upward velocity
  initialVelocityMax: -15,   // Maximum upward velocity
  horizontalSpread: 0.6,     // Side-to-side spread
  rotationSpeed: 0.1,        // Rotation multiplier
  lifetime: 2500,            // Particle lifetime in ms
  fadeOutStart: 0.7,         // When to start fading (0-1)
};

/**
 * Confetti color options
 */
export const confettiColors = [
  '#EF4444', // Red
  '#F97316', // Orange
  '#FBBF24', // Yellow
  '#10B981', // Green
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#A855F7', // Purple
  '#FF6B9D', // Pink
];

// 🎯 Animation Presets

/**
 * Button press animation values
 */
export const buttonPress = {
  scaleNormal: 0.96,         // Current subtle press
  scaleEnergetic: 0.92,      // New energetic press
  rotation: 2,               // Degrees of rotation
  opacityNormal: 0.9,        // Fade amount
  shadowExpansion: 1.5,      // Shadow size multiplier
};

/**
 * Card interaction values
 */
export const cardInteraction = {
  tiltAmount: 8,             // Max tilt in degrees
  scaleHover: 1.02,          // Hover scale
  scalePress: 0.98,          // Press scale
  shadowGrowth: 1.3,         // Shadow expansion
};

/**
 * Entrance animation values
 */
export const entrance = {
  slideDistance: 50,         // Slide distance in px
  scaleFrom: 0.8,           // Initial scale
  scaleTo: 1.0,             // Final scale
  staggerDelay: 50,         // Delay between items in ms
  fadeFrom: 0,              // Initial opacity
  fadeTo: 1,                // Final opacity
};

/**
 * Exit animation values
 */
export const exit = {
  slideDistance: 30,        // Slide distance
  scaleFrom: 1.0,          // Initial scale
  scaleTo: 0.8,            // Final scale
  fadeFrom: 1,             // Initial opacity
  fadeTo: 0,               // Final opacity
  rotationAmount: 45,      // Rotation in degrees
};

/**
 * Pulse animation (for attention)
 */
export const pulse = {
  scaleMin: 1.0,           // Minimum scale
  scaleMax: 1.1,           // Maximum scale
  duration: 1000,          // Full cycle duration
  iterations: 3,           // Number of pulses
};

/**
 * Shimmer animation (for loading)
 */
export const shimmer = {
  translateDistance: 200,   // Distance to travel
  duration: 1500,          // Full sweep duration
  opacity: 0.3,            // Shimmer opacity
};

/**
 * Breathing animation (for images)
 */
export const breathing = {
  scaleMin: 1.0,           // Minimum scale
  scaleMax: 1.02,          // Maximum scale
  duration: 2000,          // Full breath cycle
};

/**
 * Ring rotation (for buttons)
 */
export const ringRotation = {
  duration: 8000,          // Full rotation time
  continuousLoop: true,    // Loop forever
};

// 🎨 Gradient Animation

/**
 * Gradient shift timing
 */
export const gradientShift = {
  duration: 3000,          // Time to shift through colors
  loop: true,              // Continuous loop
  hueRotation: 360,        // Degrees to rotate
};

// 🎊 Milestone Thresholds

/**
 * When to celebrate milestones
 */
export const milestones = {
  small: 5,                // 5 images
  medium: 10,              // 10 images
  large: 25,               // 25 images
  confettiCount: {
    small: 20,             // Particles for small milestone
    medium: 40,            // Particles for medium
    large: 60,             // Particles for large
  },
};

// 📏 Animation Helper Functions

/**
 * Calculate stagger delay for index
 */
export const getStaggerDelay = (index: number, baseDelay: number = entrance.staggerDelay): number => {
  return index * baseDelay;
};

/**
 * Get random value between min and max
 */
export const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Get random color from confetti palette
 */
export const getRandomConfettiColor = (): string => {
  return confettiColors[Math.floor(Math.random() * confettiColors.length)];
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Linear interpolation
 */
export const lerp = (start: number, end: number, progress: number): number => {
  return start + (end - start) * progress;
};
