import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { ImageThumbnail } from '@/components/ImageThumbnail';
import { Button } from '@/components/Button';
import { ThemedText } from '@/components/ThemedText';
import { BatchImage } from '@/types/batch';
import { Spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_PADDING = Spacing.xl * 2;
const GAP = Spacing.md;
const THUMBNAIL_SIZE = (SCREEN_WIDTH - GRID_PADDING - GAP) / 2;

interface BatchImageGridProps {
  images: BatchImage[];
  onSave?: (id: string) => void;
  onRetry?: (id: string) => void;
  savedImages?: Set<string>;
}

export function BatchImageGrid({ images, onSave, onRetry, savedImages = new Set() }: BatchImageGridProps) {
  if (images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <ThemedText type="small" style={styles.emptyText}>
          No images processed yet
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.grid}>
      {images.map((image, index) => (
        <View key={image.id} style={styles.item}>
          <ImageThumbnail
            uri={image.resultUri || image.originalUri}
            size={THUMBNAIL_SIZE}
            status={image.status}
            showStatus
          />

          <View style={styles.buttonContainer}>
            {image.status === 'completed' && onSave && (
              <Button
                onPress={() => onSave(image.id)}
                disabled={savedImages.has(image.id)}
                style={styles.button}
                textStyle={styles.buttonText}
              >
                {savedImages.has(image.id) ? 'Saved' : 'Save'}
              </Button>
            )}

            {image.status === 'failed' && onRetry && (
              <Button onPress={() => onRetry(image.id)} style={styles.button} textStyle={styles.buttonText}>
                Retry
              </Button>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    padding: Spacing.xl,
  },
  item: {
    width: THUMBNAIL_SIZE,
    marginBottom: Spacing.md,
  },
  buttonContainer: {
    marginTop: Spacing.sm,
  },
  button: {
    width: '100%',
    paddingVertical: Spacing.sm,
  },
  buttonText: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
  },
});
