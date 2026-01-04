import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface BatchControlsProps {
  isProcessing: boolean;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

export function BatchControls({
  isProcessing,
  isPaused,
  onPause,
  onResume,
  onCancel,
}: BatchControlsProps) {
  return (
    <View style={styles.container}>
      {isProcessing && !isPaused && (
        <Pressable onPress={onPause} style={styles.button}>
          <Feather name="pause" size={20} color={Colors.light.primary} />
          <ThemedText type="small" style={styles.buttonText}>
            Pause
          </ThemedText>
        </Pressable>
      )}

      {isProcessing && isPaused && (
        <Pressable onPress={onResume} style={styles.button}>
          <Feather name="play" size={20} color={Colors.light.success} />
          <ThemedText type="small" style={styles.buttonText}>
            Resume
          </ThemedText>
        </Pressable>
      )}

      {isProcessing && (
        <Pressable onPress={onCancel} style={styles.button}>
          <Feather name="x" size={20} color={Colors.light.error} />
          <ThemedText type="small" style={styles.buttonText}>
            Cancel
          </ThemedText>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.lg,
    padding: Spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  buttonText: {
    color: Colors.light.text,
  },
});
