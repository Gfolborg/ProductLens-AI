import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
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
import {
  documentDirectory,
  writeAsStringAsync,
  deleteAsync,
  EncodingType,
} from "expo-file-system";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
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
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

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
      const fileUri = documentDirectory + filename;

      const base64Data = resultUri.split(",")[1];
      await writeAsStringAsync(fileUri, base64Data, {
        encoding: EncodingType.Base64,
      });

      await MediaLibrary.saveToLibraryAsync(fileUri);

      await deleteAsync(fileUri, { idempotent: true });

      setSaved(true);
      
      if (Platform.OS !== "web") {
        Alert.alert("Saved", "Your Amazon-ready image has been saved to your gallery.");
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
        <Image
          source={{ uri: resultUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.specContainer}>
        <ThemedText type="small" style={styles.specText}>
          2000 x 2000 - JPG - White Background
        </ThemedText>
      </View>

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
          style={styles.secondaryButton}
        >
          <ThemedText style={styles.secondaryButtonText}>Generate Another</ThemedText>
        </Button>
      </View>
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
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: Colors.light.white,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  specContainer: {
    marginTop: Spacing.md,
  },
  specText: {
    color: Colors.light.textSecondary,
  },
  buttonContainer: {
    width: "100%",
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  primaryButton: {
    width: "100%",
    backgroundColor: Colors.light.success,
  },
  savedButton: {
    backgroundColor: Colors.light.textSecondary,
  },
  secondaryButton: {
    width: "100%",
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  buttonText: {
    color: Colors.light.white,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
});
