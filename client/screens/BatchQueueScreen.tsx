import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system/legacy';

import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/Button';
import { ProgressBar } from '@/components/ProgressBar';
import { BatchImageGrid } from '@/components/BatchImageGrid';
import { BatchControls } from '@/components/BatchControls';
import { ParticleSystem } from '@/components/ParticleSystem';
import { AnimatedProgress } from '@/components/AnimatedProgress';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { RootStackParamList } from '@/navigation/RootStackNavigator';
import { useBatchQueue } from '@/contexts/BatchQueueContext';
import { BatchProcessor } from '@/lib/batch-processor';
import { BatchImage } from '@/types/batch';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BatchQueue'>;
type BatchQueueRouteProp = RouteProp<RootStackParamList, 'BatchQueue'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_SIZE = SCREEN_WIDTH * 0.6;

export default function BatchQueueScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BatchQueueRouteProp>();
  const { imageUris } = route.params;

  const { state, addImages, updateImageStatus, setCurrentIndex, setIsProcessing, setIsPaused, resetQueue } = useBatchQueue();
  const processorRef = useRef<BatchProcessor>(new BatchProcessor());
  const scrollViewRef = useRef<ScrollView>(null);

  const [hasStarted, setHasStarted] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState<string | null>(null);
  const [savedImages, setSavedImages] = useState<Set<string>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Initialize queue with images
  useEffect(() => {
    addImages(imageUris);
  }, []);

  // Start processing automatically
  useEffect(() => {
    if (state.images.length > 0 && !hasStarted) {
      setHasStarted(true);
      startProcessing();
    }
  }, [state.images.length, hasStarted]);

  const startProcessing = async () => {
    setIsProcessing(true);

    await processorRef.current.processQueue(imageUris, {
      onImageStart: (index) => {
        setCurrentIndex(index);
        setCurrentImageUri(imageUris[index]);
        updateImageStatus(state.images[index].id, 'processing');
      },
      onImageComplete: (index, resultUri) => {
        updateImageStatus(state.images[index].id, 'completed', resultUri);
        setCurrentImageUri(null);
      },
      onImageError: (index, error) => {
        updateImageStatus(state.images[index].id, 'failed', null, error);
        setCurrentImageUri(null);
      },
      onProgress: (current, total) => {
        // Progress is automatically shown via ProgressBar component
      },
      onQueueComplete: (successCount, failureCount) => {
        setIsProcessing(false);
        setCurrentImageUri(null);

        // Show confetti celebration!
        if (successCount > 0) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 2500);
        }

        const totalProcessed = successCount + failureCount;
        const message = failureCount > 0
          ? `Crushing it! ${successCount} images ready, ${failureCount} had issues.`
          : `Boom! All ${successCount} images are ready! You're on fire! 🔥🎉`;

        if (Platform.OS !== 'web') {
          Alert.alert('Mission Complete! 🎉', message);
        }
      },
    });
  };

  const handlePause = () => {
    processorRef.current.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    processorRef.current.resume();
    setIsPaused(false);
  };

  const handleCancel = () => {
    if (Platform.OS !== 'web') {
      Alert.alert(
        'Cancel Processing',
        'Are you sure you want to cancel? Completed images will be saved.',
        [
          { text: 'Continue Processing', style: 'cancel' },
          {
            text: 'Cancel',
            style: 'destructive',
            onPress: () => {
              processorRef.current.cancel();
              setIsProcessing(false);
              setCurrentImageUri(null);
            },
          },
        ]
      );
    } else {
      processorRef.current.cancel();
      setIsProcessing(false);
      setCurrentImageUri(null);
    }
  };

  const handleSave = async (imageId: string) => {
    const image = state.images.find(img => img.id === imageId);
    if (!image || !image.resultUri) return;

    setIsSaving(true);

    try {
      // Request permissions
      const { status } = await MediaLibrary.getPermissionsAsync();

      if (status !== 'granted') {
        const { status: newStatus, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

        if (newStatus !== 'granted') {
          if (!canAskAgain && Platform.OS !== 'web') {
            Alert.alert(
              'Permission Required',
              'Please enable gallery access in your device settings to save photos.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Open Settings',
                  onPress: async () => {
                    try {
                      const { Linking } = await import('react-native');
                      await Linking.openSettings();
                    } catch (e) {
                      console.error('Could not open settings');
                    }
                  },
                },
              ]
            );
          }
          setIsSaving(false);
          return;
        }
      }

      const filename = `amazon_main_${Date.now()}.jpg`;
      const fileUri = FileSystem.documentDirectory + filename;

      const base64Data = image.resultUri.split(',')[1];
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await MediaLibrary.saveToLibraryAsync(fileUri);
      await FileSystem.deleteAsync(fileUri, { idempotent: true });

      setSavedImages(prev => new Set(prev).add(imageId));

      if (Platform.OS !== 'web') {
        Alert.alert('Saved! 💾', 'Your Amazon-ready image is in your gallery!');
      }
    } catch (error) {
      console.error('Failed to save image:', error);

      if (Platform.OS !== 'web') {
        Alert.alert('Save Failed', 'Could not save the image to your gallery. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAll = async () => {
    const completedImages = state.images.filter(img => img.status === 'completed' && img.resultUri);
    const unsavedImages = completedImages.filter(img => !savedImages.has(img.id));

    if (unsavedImages.length === 0) {
      if (Platform.OS !== 'web') {
        Alert.alert('Already Saved', 'All images have already been saved.');
      }
      return;
    }

    setIsSaving(true);

    try {
      // Request permissions once
      const { status } = await MediaLibrary.getPermissionsAsync();

      if (status !== 'granted') {
        const { status: newStatus, canAskAgain } = await MediaLibrary.requestPermissionsAsync();

        if (newStatus !== 'granted') {
          if (!canAskAgain && Platform.OS !== 'web') {
            Alert.alert(
              'Permission Required',
              'Please enable gallery access in your device settings to save photos.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Open Settings',
                  onPress: async () => {
                    try {
                      const { Linking } = await import('react-native');
                      await Linking.openSettings();
                    } catch (e) {
                      console.error('Could not open settings');
                    }
                  },
                },
              ]
            );
          }
          setIsSaving(false);
          return;
        }
      }

      let successCount = 0;
      let failureCount = 0;

      for (const image of unsavedImages) {
        try {
          const filename = `amazon_main_${Date.now()}_${successCount}.jpg`;
          const fileUri = FileSystem.documentDirectory + filename;

          const base64Data = image.resultUri!.split(',')[1];
          await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
          });

          await MediaLibrary.saveToLibraryAsync(fileUri);
          await FileSystem.deleteAsync(fileUri, { idempotent: true });

          setSavedImages(prev => new Set(prev).add(image.id));
          successCount++;
        } catch (error) {
          console.error('Failed to save image:', error);
          failureCount++;
        }
      }

      const message = failureCount > 0
        ? `Saved ${successCount} of ${unsavedImages.length} images. Not bad! 💪`
        : `All ${successCount} images saved! You're crushing it! 🎉🔥`;

      if (Platform.OS !== 'web') {
        Alert.alert('Mission Accomplished! 💾', message);
      }
    } catch (error) {
      console.error('Failed to save images:', error);

      if (Platform.OS !== 'web') {
        Alert.alert('Save Failed', 'Could not save images to your gallery. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleRetry = async (imageId: string) => {
    const image = state.images.find(img => img.id === imageId);
    if (!image) return;

    // Update status to processing
    updateImageStatus(imageId, 'processing');
    setCurrentImageUri(image.originalUri);

    // Process the image
    const result = await processorRef.current.processSingleImage(image.originalUri);

    if (result.success && result.resultUri) {
      updateImageStatus(imageId, 'completed', result.resultUri);
      setCurrentImageUri(null);

      if (Platform.OS !== 'web') {
        Alert.alert('Success', 'Image processed successfully!');
      }
    } else {
      updateImageStatus(imageId, 'failed', null, result.error || 'Unknown error');
      setCurrentImageUri(null);

      if (Platform.OS !== 'web') {
        Alert.alert('Retry Failed', result.error || 'Failed to process image. Please try again.');
      }
    }
  };

  const handleDone = () => {
    resetQueue();
    navigation.navigate('Camera');
  };

  const completedImages = state.images.filter(img => img.status === 'completed' || img.status === 'failed');
  const processingCount = state.images.filter(img => img.status === 'processing').length;
  const completedCount = state.images.filter(img => img.status === 'completed').length;

  return (
    <View style={styles.container}>
      {/* Header with Progress */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <ThemedText type="h4" style={styles.title}>
          Transformation Station 🎨
        </ThemedText>
        <AnimatedProgress
          progress={(completedImages.length / state.images.length) * 100}
          showMilestones={true}
          celebrateMilestones={true}
        />
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + Spacing.xl + 120 },
        ]}
      >
        {/* Current Processing Image */}
        {state.isProcessing && currentImageUri && (
          <View style={styles.currentSection}>
            <ThemedText type="small" style={styles.sectionLabel}>
              Currently Processing
            </ThemedText>
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: currentImageUri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <ThemedText style={styles.processingText}>
                  Processing...
                </ThemedText>
              </View>
            </View>
          </View>
        )}

        {/* Completed Images Grid */}
        {completedImages.length > 0 && (
          <View style={styles.completedSection}>
            <ThemedText type="small" style={styles.sectionLabel}>
              Processed Images ({completedImages.length}/{state.images.length})
            </ThemedText>
            <BatchImageGrid
              images={completedImages}
              onSave={handleSave}
              onRetry={handleRetry}
              savedImages={savedImages}
            />
          </View>
        )}

        {/* Empty State */}
        {!state.isProcessing && completedImages.length === 0 && (
          <View style={styles.emptyState}>
            <ThemedText type="small" style={styles.emptyText}>
              No images processed yet
            </ThemedText>
          </View>
        )}
      </ScrollView>

      {/* Controls Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
        {state.isProcessing && (
          <BatchControls
            isProcessing={state.isProcessing}
            isPaused={state.isPaused}
            onPause={handlePause}
            onResume={handleResume}
            onCancel={handleCancel}
          />
        )}

        {!state.isProcessing && completedCount > 0 && (
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleSaveAll}
              disabled={isSaving || savedImages.size === completedCount}
              variant="primary"
              style={styles.saveAllButton}
            >
              {isSaving ? 'Saving...' : savedImages.size === completedCount ? 'All Saved' : 'Save All'}
            </Button>
            <Button
              onPress={handleDone}
              variant="secondary"
              style={styles.doneButton}
            >
              Done
            </Button>
          </View>
        )}
      </View>

      {/* 🎊 Confetti celebration on completion! */}
      {showConfetti && (
        <ParticleSystem
          particleCount={60}
          duration={2500}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    backgroundColor: Colors.light.white,
  },
  title: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.xl,
  },
  currentSection: {
    marginBottom: Spacing.xl,
  },
  sectionLabel: {
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  previewContainer: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    alignSelf: 'center',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.backgroundDefault,
    overflow: 'hidden',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.light.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  processingText: {
    color: Colors.light.white,
    fontWeight: '600',
  },
  completedSection: {
    marginTop: Spacing.lg,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['4xl'],
  },
  emptyText: {
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.white,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    gap: Spacing.md,
  },
  saveAllButton: {
    flex: 1,
  },
  doneButton: {
    flex: 1,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
