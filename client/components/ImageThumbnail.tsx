import React from 'react';
import { View, Image, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ProcessingStatus } from '@/types/batch';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';

interface ImageThumbnailProps {
  uri: string;
  size?: number;
  onRemove?: () => void;
  onPress?: () => void;
  status?: ProcessingStatus;
  showStatus?: boolean;
}

export function ImageThumbnail({
  uri,
  size = 100,
  onRemove,
  onPress,
  status = 'pending',
  showStatus = false,
}: ImageThumbnailProps) {
  const getBorderColor = () => {
    if (!showStatus) return Colors.light.border;

    switch (status) {
      case 'completed':
        return Colors.light.success;
      case 'failed':
        return Colors.light.error;
      case 'processing':
        return Colors.light.primary;
      default:
        return Colors.light.textSecondary;
    }
  };

  const renderStatusBadge = () => {
    if (!showStatus) return null;

    return (
      <View style={styles.statusBadge}>
        {status === 'completed' && (
          <Feather name="check-circle" size={20} color={Colors.light.success} />
        )}
        {status === 'failed' && (
          <Feather name="x-circle" size={20} color={Colors.light.error} />
        )}
        {status === 'processing' && (
          <ActivityIndicator size="small" color={Colors.light.primary} />
        )}
        {status === 'pending' && (
          <Feather name="clock" size={20} color={Colors.light.textSecondary} />
        )}
      </View>
    );
  };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        { width: size, height: size, borderColor: getBorderColor() },
      ]}
      disabled={!onPress}
    >
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />

      {renderStatusBadge()}

      {onRemove && (
        <Pressable
          onPress={onRemove}
          style={styles.removeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.removeButtonInner}>
            <Feather name="x" size={14} color={Colors.light.white} />
          </View>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    bottom: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: Colors.light.white,
    borderRadius: BorderRadius.full,
    padding: Spacing.xs / 2,
  },
  removeButton: {
    position: 'absolute',
    top: Spacing.xs,
    right: Spacing.xs,
  },
  removeButtonInner: {
    backgroundColor: Colors.light.error,
    borderRadius: BorderRadius.full,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
