import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HeaderButton } from "@react-navigation/elements";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { GestureImage } from "@/components/GestureImage";
import { ParticleSystem } from "@/components/ParticleSystem";
import { Colors, Spacing, BorderRadius, Shadows } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Result">;
type ResultRouteProp = RouteProp<RootStackParamList, "Result">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = SCREEN_WIDTH * 0.85;

export default function ResultScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ResultRouteProp>();
  const { resultUri } = route.params;

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  // 🎉 Trigger confetti celebration on mount
  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          onPress={() => navigation.popToTop()}
          pressOpacity={0.7}
        >
          <ThemedText style={styles.headerButton}>Done</ThemedText>
        </HeaderButton>
      ),
    });
  }, [navigation]);

  const handleSaveToGallery = async () => {
    setIsSaving(true);

    try {
      if (!permissionResponse?.granted) {
        const newPermission = await requestPermission();
        if (!newPermission.granted) {
          if (!newPermission.canAskAgain && Platform.OS !== "web") {
            Alert.alert(
              "Permission Required",
              "Please enable gallery access in your device settings to save photos.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Open Settings",
                  onPress: async () => {
                    try {
                      const { Linking } = await import("react-native");
                      await Linking.openSettings();
                    } catch (e) {
                      console.error("Could not open settings");
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

      const base64Data = resultUri.split(",")[1];
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await MediaLibrary.saveToLibraryAsync(fileUri);

      await FileSystem.deleteAsync(fileUri, { idempotent: true });

      setSaved(true);

      if (Platform.OS !== "web") {
        Alert.alert(
          "Success! 🎉",
          "Your perfect Amazon photo is ready! Keep crushing it! 🔥"
        );
      }
    } catch (error) {
      console.error("Failed to save image:", error);
      
      if (Platform.OS !== "web") {
        Alert.alert("Save Failed", "Could not save the image to your gallery. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleGenerateAnother = () => {
    navigation.popToTop();
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + Spacing.xl },
      ]}
    >
      <View style={styles.imageContainer}>
        <GestureImage
          source={{ uri: resultUri }}
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          borderRadius={BorderRadius.lg}
          resizeMode="contain"
          minScale={1}
          maxScale={3}
          doubleTapScale={2}
        />
      </View>

      <View style={styles.specContainer}>
        <ThemedText type="small" style={styles.specText}>
          ✨ 2000 x 2000 - JPG - White Background
        </ThemedText>
      </View>

      {saved && (
        <View style={styles.successCard}>
          <ThemedText type="h4" style={styles.successTitle}>
            Boom! 🎉
          </ThemedText>
          <ThemedText type="small" style={styles.successText}>
            Your perfect Amazon photo is in your gallery! You're crushing it! 🔥
          </ThemedText>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleSaveToGallery}
          disabled={isSaving || saved}
          style={[styles.primaryButton, saved && styles.savedButton]}
        >
          {isSaving ? (
            <View style={styles.loadingContent}>
              <ActivityIndicator color={Colors.light.white} size="small" />
              <ThemedText style={styles.buttonText}>Saving...</ThemedText>
            </View>
          ) : saved ? (
            <View style={styles.loadingContent}>
              <ThemedText style={styles.buttonText}>Saved to Gallery</ThemedText>
            </View>
          ) : (
            "Save to Gallery"
          )}
        </Button>

        <Button
          onPress={handleGenerateAnother}
          variant="outline"
          style={styles.secondaryButton}
        >
          Generate Another
        </Button>
      </View>

      {/* 🎊 Confetti celebration! */}
      {showConfetti && (
        <ParticleSystem
          particleCount={50}
          duration={2500}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.backgroundRoot,
  },
  content: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    alignItems: "center",
  },
  headerButton: {
    color: Colors.light.primary,
    fontWeight: "500",
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.light.backgroundCard,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    ...Shadows.lg,
  },
  specContainer: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.backgroundCard,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    ...Shadows.sm,
  },
  specText: {
    color: Colors.light.textSecondary,
  },
  successCard: {
    marginTop: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.light.successLight,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.light.success,
    alignItems: "center",
    ...Shadows.sm,
  },
  successTitle: {
    color: Colors.light.success,
    marginBottom: Spacing.xs,
  },
  successText: {
    color: Colors.light.success,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  primaryButton: {
    width: "100%",
  },
  savedButton: {
    opacity: 0.7,
  },
  secondaryButton: {
    width: "100%",
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  buttonText: {
    color: Colors.light.white,
    fontWeight: "700",
  },
});
