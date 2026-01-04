import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  Linking,
  ActivityIndicator,
  Dimensions,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { ringRotation } from "@/lib/animations";
import { useTheme } from "@/hooks/useTheme";
import { CameraCopy } from "@/constants/copy";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Camera">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [tooltipShown, setTooltipShown] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  // Rotating gradient ring animation
  const ringRotationValue = useSharedValue(0);

  // Start continuous rotation animation when camera is enabled
  useEffect(() => {
    if (cameraEnabled) {
      ringRotationValue.value = withRepeat(
        withTiming(360, {
          duration: ringRotation.duration,
          easing: Easing.linear,
        }),
        -1, // Infinite loop
        false
      );
    }
  }, [cameraEnabled]);

  const handleEnableCamera = async () => {
    const result = await requestPermission();
    if (result.granted) {
      setCameraEnabled(true);
    }
  };

  // Show tooltip on first camera enable
  useEffect(() => {
    if (cameraEnabled && !tooltipShown) {
      setTimeout(() => {
        Alert.alert(
          CameraCopy.tooltip.title,
          CameraCopy.tooltip.message,
          [{ text: CameraCopy.tooltip.button, onPress: () => setTooltipShown(true) }]
        );
      }, 500);
    }
  }, [cameraEnabled, tooltipShown]);

  const captureScale = useSharedValue(1);
  const captureOpacity = useSharedValue(0.3);

  const captureAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: captureScale.value }],
    backgroundColor: `rgba(255, 255, 255, ${captureOpacity.value})`,
  }));

  const ringAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${ringRotationValue.value}deg` }],
  }));

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    captureScale.value = withSpring(0.9);
    captureOpacity.value = withSpring(1);

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      if (photo?.uri) {
        if (batchMode) {
          // Batch mode: add to array
          setCapturedImages(prev => [...prev, photo.uri]);
        } else {
          // Single mode: navigate to preview
          navigation.navigate("Preview", { imageUri: photo.uri });
        }
      }
    } catch (error) {
      console.error("Failed to capture photo:", error);
    } finally {
      setIsCapturing(false);
      captureScale.value = withSpring(1);
      captureOpacity.value = withSpring(0.3);
    }
  };

  const handleLongPressCapture = () => {
    if (!batchMode) {
      setBatchMode(true);
      Platform.OS !== 'web' && require('expo-haptics')?.impactAsync(require('expo-haptics').ImpactFeedbackStyle.Medium);
    }
  };

  const handleBatchDone = () => {
    if (capturedImages.length > 0) {
      navigation.navigate("BatchSelection", { imageUris: capturedImages });
      setBatchMode(false);
      setCapturedImages([]);
    }
  };

  const handleBatchCancel = () => {
    setBatchMode(false);
    setCapturedImages([]);
  };

  const handleRemoveBatchImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePickImage = async (multiSelect: boolean = false) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: multiSelect,
      selectionLimit: multiSelect ? 10 : 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      if (multiSelect && result.assets.length > 1) {
        // Navigate to batch selection screen
        navigation.navigate("BatchSelection", {
          imageUris: result.assets.map((asset) => asset.uri),
        });
      } else {
        // Single image flow (existing)
        navigation.navigate("Preview", { imageUri: result.assets[0].uri });
      }
    }
  };

  if (!permission) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  // Show permission request screen if camera hasn't been explicitly enabled yet
  if (!cameraEnabled) {
    if (permission.status === "denied" && !permission.canAskAgain) {
      return (
        <View style={[styles.container, styles.centered, styles.permissionContainer]}>
          <View style={styles.permissionContent}>
            <Feather name="camera-off" size={64} color={Colors.light.primary} />
            <ThemedText type="h4" style={styles.permissionTitle}>
              {CameraCopy.permissions.denied}
            </ThemedText>
            <ThemedText style={styles.permissionText}>
              {CameraCopy.permissions.deniedMessage}
            </ThemedText>
            {Platform.OS !== "web" && (
              <Pressable
                style={styles.settingsButton}
                onPress={async () => {
                  try {
                    await Linking.openSettings();
                  } catch (error) {
                    console.error("Could not open settings");
                  }
                }}
              >
                <ThemedText style={styles.settingsButtonText}>{CameraCopy.permissions.openSettings}</ThemedText>
              </Pressable>
            )}
          </View>
        </View>
      );
    }

    return (
      <View style={[styles.container, styles.centered, styles.permissionContainer]}>
        <View style={styles.permissionContent}>
          <Feather name="camera" size={64} color={Colors.light.primary} />
          <ThemedText type="h4" style={styles.permissionTitle}>
            {CameraCopy.permissions.title}
          </ThemedText>
          <ThemedText style={styles.permissionText}>
            {CameraCopy.permissions.message}
          </ThemedText>
          <Pressable style={styles.enableButton} onPress={handleEnableCamera}>
            <ThemedText style={styles.enableButtonText}>{CameraCopy.permissions.enableButton}</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <BlurView
          intensity={80}
          tint="dark"
          style={[styles.overlay, { paddingTop: insets.top + Spacing.xl }]}
        >
          <View style={styles.header}>
            <ThemedText type="h4" style={styles.headerTitle}>
              {batchMode ? CameraCopy.batchModeTitle(capturedImages.length) : CameraCopy.title}
            </ThemedText>
          </View>
        </BlurView>

        {batchMode && capturedImages.length > 0 && (
          <View style={[styles.batchThumbnailStrip, { top: insets.top + Spacing.xl * 2.5 }]}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailContainer}>
              {capturedImages.map((uri, index) => (
                <View key={index} style={styles.thumbnailWrapper}>
                  <Image source={{ uri }} style={styles.thumbnail} resizeMode="cover" />
                  <Pressable onPress={() => handleRemoveBatchImage(index)} style={styles.thumbnailRemove}>
                    <Feather name="x" size={14} color={Colors.light.white} />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {batchMode ? (
          <View style={[styles.batchControls, { paddingBottom: insets.bottom + Spacing.xl }]}>
            <Pressable style={styles.batchButton} onPress={handleBatchCancel}>
              <ThemedText style={styles.batchButtonText}>{CameraCopy.batchCancelButton}</ThemedText>
            </Pressable>

            <Pressable onPress={handleCapture} disabled={isCapturing || capturedImages.length >= 10}>
              <View style={styles.captureButtonContainer}>
                {/* Rotating gradient ring */}
                <Animated.View style={[styles.gradientRing, ringAnimatedStyle]}>
                  <LinearGradient
                    colors={[
                      theme.gradients.heroStart,
                      theme.gradients.energyMiddle,
                      theme.gradients.successStart,
                      theme.gradients.heroEnd,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientRingInner}
                  />
                </Animated.View>

                {/* Capture button */}
                <Animated.View style={[styles.captureButton, captureAnimatedStyle, capturedImages.length >= 10 && styles.captureButtonDisabled]}>
                  {isCapturing ? (
                    <ActivityIndicator color={Colors.light.primary} />
                  ) : (
                    <View style={styles.captureInner} />
                  )}
                </Animated.View>
              </View>
            </Pressable>

            <Pressable
              style={[styles.batchButton, capturedImages.length === 0 && styles.batchButtonDisabled]}
              onPress={handleBatchDone}
              disabled={capturedImages.length === 0}
            >
              <ThemedText style={styles.batchButtonText}>{CameraCopy.batchDoneButton}</ThemedText>
            </Pressable>
          </View>
        ) : (
          <View
            style={[
              styles.controls,
              { paddingBottom: insets.bottom + Spacing.xl },
            ]}
          >
            <Pressable
              style={styles.galleryButton}
              onPress={() => handlePickImage(false)}
            >
              <Feather name="image" size={24} color={Colors.light.white} />
              <ThemedText style={styles.galleryButtonText}>{CameraCopy.uploadButton}</ThemedText>
            </Pressable>

            <Pressable onPress={handleCapture} onLongPress={handleLongPressCapture} disabled={isCapturing}>
              <View style={styles.captureButtonContainer}>
                {/* Rotating gradient ring */}
                <Animated.View style={[styles.gradientRing, ringAnimatedStyle]}>
                  <LinearGradient
                    colors={[
                      theme.gradients.heroStart,
                      theme.gradients.energyMiddle,
                      theme.gradients.successStart,
                      theme.gradients.heroEnd,
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientRingInner}
                  />
                </Animated.View>

                {/* Capture button */}
                <Animated.View style={[styles.captureButton, captureAnimatedStyle]}>
                  {isCapturing ? (
                    <ActivityIndicator color={Colors.light.primary} />
                  ) : (
                    <View style={styles.captureInner} />
                  )}
                </Animated.View>
              </View>
            </Pressable>

            <Pressable
              style={styles.galleryButton}
              onPress={() => handlePickImage(true)}
            >
              <Feather name="copy" size={24} color={Colors.light.white} />
              <ThemedText style={styles.galleryButtonText}>{CameraCopy.multipleButton}</ThemedText>
            </Pressable>
          </View>
        )}
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  permissionContainer: {
    backgroundColor: Colors.light.backgroundRoot,
  },
  permissionContent: {
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  },
  permissionTitle: {
    marginTop: Spacing.lg,
    textAlign: "center",
  },
  permissionText: {
    marginTop: Spacing.sm,
    textAlign: "center",
    color: Colors.light.textSecondary,
  },
  enableButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  enableButtonText: {
    color: Colors.light.white,
    fontWeight: "600",
  },
  settingsButton: {
    marginTop: Spacing.xl,
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  settingsButtonText: {
    color: Colors.light.white,
    fontWeight: "600",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: Spacing.md,
  },
  headerTitle: {
    color: Colors.light.white,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: 80,
  },
  galleryButton: {
    width: 70,
    alignItems: "center",
    gap: Spacing.xs,
  },
  galleryButtonText: {
    color: Colors.light.white,
    fontSize: 10,
    fontWeight: "600",
  },
  captureButtonContainer: {
    position: "relative",
    width: Spacing.captureButtonSize + 16,
    height: Spacing.captureButtonSize + 16,
    justifyContent: "center",
    alignItems: "center",
  },
  gradientRing: {
    position: "absolute",
    width: Spacing.captureButtonSize + 16,
    height: Spacing.captureButtonSize + 16,
    borderRadius: (Spacing.captureButtonSize + 16) / 2,
    padding: 3,
  },
  gradientRingInner: {
    width: "100%",
    height: "100%",
    borderRadius: (Spacing.captureButtonSize + 16) / 2,
  },
  captureButton: {
    width: Spacing.captureButtonSize,
    height: Spacing.captureButtonSize,
    borderRadius: Spacing.captureButtonSize / 2,
    borderWidth: Spacing.captureButtonBorder,
    borderColor: Colors.light.white,
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.xl,
  },
  captureInner: {
    width: Spacing.captureButtonSize - 16,
    height: Spacing.captureButtonSize - 16,
    borderRadius: (Spacing.captureButtonSize - 16) / 2,
    backgroundColor: Colors.light.white,
  },
  placeholderButton: {
    width: 70,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  batchThumbnailStrip: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: Spacing.md,
  },
  thumbnailContainer: {
    gap: Spacing.sm,
  },
  thumbnailWrapper: {
    position: "relative",
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.light.white,
  },
  thumbnailRemove: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: Colors.light.error,
    borderRadius: BorderRadius.full,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  batchControls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingBottom: 80,
  },
  batchButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.primary,
    borderRadius: BorderRadius.sm,
  },
  batchButtonText: {
    color: Colors.light.white,
    fontWeight: "600",
    fontSize: 14,
  },
  batchButtonDisabled: {
    opacity: 0.5,
  },
});
