import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  Linking,
  ActivityIndicator,
  Dimensions,
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
} from "react-native-reanimated";

import { ThemedText } from "@/components/ThemedText";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Camera">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function CameraScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const [selectionMode, setSelectionMode] = useState<"single" | "batch">("single");

  const captureScale = useSharedValue(1);
  const captureOpacity = useSharedValue(0.3);

  const captureAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: captureScale.value }],
    backgroundColor: `rgba(255, 255, 255, ${captureOpacity.value})`,
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
        navigation.navigate("Preview", { imageUri: photo.uri });
      }
    } catch (error) {
      console.error("Failed to capture photo:", error);
    } finally {
      setIsCapturing(false);
      captureScale.value = withSpring(1);
      captureOpacity.value = withSpring(0.3);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: selectionMode === "batch",
      selectionLimit: selectionMode === "batch" ? 10 : 1,
    });

    if (!result.canceled) {
      if (selectionMode === "batch" && result.assets.length > 1) {
        const imageUris = result.assets.map((asset) => asset.uri);
        navigation.navigate("BatchPreview", { imageUris });
      } else if (result.assets[0]) {
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

  if (!permission.granted) {
    if (permission.status === "denied" && !permission.canAskAgain) {
      return (
        <View style={[styles.container, styles.centered, styles.permissionContainer]}>
          <View style={styles.permissionContent}>
            <Feather name="camera-off" size={64} color={Colors.light.primary} />
            <ThemedText type="h4" style={styles.permissionTitle}>
              Camera Access Required
            </ThemedText>
            <ThemedText style={styles.permissionText}>
              Please enable camera access in your device settings to capture product photos.
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
                <ThemedText style={styles.settingsButtonText}>Open Settings</ThemedText>
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
            Enable Camera
          </ThemedText>
          <ThemedText style={styles.permissionText}>
            To capture product photos, we need access to your camera.
          </ThemedText>
          <Pressable style={styles.enableButton} onPress={requestPermission}>
            <ThemedText style={styles.enableButtonText}>Enable Camera</ThemedText>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <CameraView ref={cameraRef} style={styles.camera} facing="back">
        <View style={[styles.overlay, { paddingTop: insets.top + Spacing.xl }]}>
          <View style={styles.header}>
            <ThemedText type="h4" style={styles.headerTitle}>
              Amazon Main (Safe Mode)
            </ThemedText>

            <View style={styles.segmentedControl}>
              <Pressable
                style={[
                  styles.segmentButton,
                  styles.segmentButtonLeft,
                  selectionMode === "single" && styles.segmentButtonActive,
                ]}
                onPress={() => setSelectionMode("single")}
              >
                <Feather
                  name="image"
                  size={16}
                  color={
                    selectionMode === "single"
                      ? Colors.light.primary
                      : Colors.light.white
                  }
                />
                <ThemedText
                  style={[
                    styles.segmentText,
                    selectionMode === "single" && styles.segmentTextActive,
                  ]}
                >
                  Single
                </ThemedText>
              </Pressable>

              <Pressable
                style={[
                  styles.segmentButton,
                  styles.segmentButtonRight,
                  selectionMode === "batch" && styles.segmentButtonActive,
                ]}
                onPress={() => setSelectionMode("batch")}
              >
                <Feather
                  name="layers"
                  size={16}
                  color={
                    selectionMode === "batch"
                      ? Colors.light.primary
                      : Colors.light.white
                  }
                />
                <ThemedText
                  style={[
                    styles.segmentText,
                    selectionMode === "batch" && styles.segmentTextActive,
                  ]}
                >
                  Batch
                </ThemedText>
              </Pressable>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.controls,
            { paddingBottom: insets.bottom + Spacing.xl },
          ]}
        >
          <Pressable
            style={styles.galleryButton}
            onPress={handlePickImage}
          >
            <Feather name="image" size={24} color={Colors.light.white} />
          </Pressable>

          <Pressable onPress={handleCapture} disabled={isCapturing}>
            <Animated.View style={[styles.captureButton, captureAnimatedStyle]}>
              {isCapturing ? (
                <ActivityIndicator color={Colors.light.primary} />
              ) : (
                <View style={styles.captureInner} />
              )}
            </Animated.View>
          </Pressable>

          <View style={styles.placeholderButton} />
        </View>
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
    marginBottom: Spacing.md,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: BorderRadius.full,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  segmentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    minWidth: 100,
  },
  segmentButtonLeft: {
    borderTopLeftRadius: BorderRadius.full,
    borderBottomLeftRadius: BorderRadius.full,
  },
  segmentButtonRight: {
    borderTopRightRadius: BorderRadius.full,
    borderBottomRightRadius: BorderRadius.full,
  },
  segmentButtonActive: {
    backgroundColor: Colors.light.white,
  },
  segmentText: {
    color: Colors.light.white,
    fontSize: 14,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  segmentTextActive: {
    color: Colors.light.primary,
    textShadowColor: "transparent",
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
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: Spacing.captureButtonSize,
    height: Spacing.captureButtonSize,
    borderRadius: Spacing.captureButtonSize / 2,
    borderWidth: Spacing.captureButtonBorder,
    borderColor: Colors.light.white,
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: Spacing.captureButtonSize - 16,
    height: Spacing.captureButtonSize - 16,
    borderRadius: (Spacing.captureButtonSize - 16) / 2,
    backgroundColor: Colors.light.white,
  },
  placeholderButton: {
    width: 48,
    height: 48,
  },
});
