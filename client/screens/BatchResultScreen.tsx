import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system/legacy";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BatchResult"
>;
type RouteProps = RouteProp<RootStackParamList, "BatchResult">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = (SCREEN_WIDTH - Spacing.xl * 3) / 2;

export default function BatchResultScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { results } = route.params;

  const [savedUris, setSavedUris] = useState<Set<string>>(new Set());
  const [savingUris, setSavingUris] = useState<Set<string>>(new Set());
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

  const successfulResults = results.filter((r) => r.resultUri !== null);

  const handleSaveImage = async (resultUri: string, originalUri: string) => {
    setSavingUris((prev) => new Set([...prev, originalUri]));

    try {
      if (!permissionResponse?.granted) {
        const newPermission = await requestPermission();
        if (!newPermission.granted) {
          Alert.alert(
            "Permission Required",
            "Please grant permission to save images to your gallery."
          );
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

      setSavedUris((prev) => new Set([...prev, originalUri]));
      Alert.alert("Saved", "Image saved to gallery");
    } catch (error) {
      Alert.alert("Error", "Failed to save image");
      console.error("Save error:", error);
    } finally {
      setSavingUris((prev) => {
        const newSet = new Set(prev);
        newSet.delete(originalUri);
        return newSet;
      });
    }
  };

  const handleSaveAll = async () => {
    for (const result of successfulResults) {
      if (result.resultUri && !savedUris.has(result.originalUri)) {
        await handleSaveImage(result.resultUri, result.originalUri);
      }
    }
  };

  const handleGenerateMore = () => {
    navigation.popToTop();
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingTop: Spacing.md }]}>
        <View style={styles.header}>
          <ThemedText type="h3">Results</ThemedText>
          <ThemedText type="small" style={styles.subtitle}>
            {successfulResults.length} of {results.length} images processed successfully
          </ThemedText>
        </View>

        <FlatList
          data={results}
          numColumns={2}
          keyExtractor={(item) => item.originalUri}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <View style={styles.resultCard}>
              {item.resultUri ? (
                <>
                  <Image source={{ uri: item.resultUri }} style={styles.image} />
                  <Pressable
                    style={[
                      styles.saveButton,
                      (savingUris.has(item.originalUri) ||
                        savedUris.has(item.originalUri)) &&
                        styles.saveButtonDisabled,
                    ]}
                    onPress={() =>
                      handleSaveImage(item.resultUri!, item.originalUri)
                    }
                    disabled={
                      savingUris.has(item.originalUri) ||
                      savedUris.has(item.originalUri)
                    }
                  >
                    {savingUris.has(item.originalUri) ? (
                      <ActivityIndicator
                        size="small"
                        color={Colors.light.white}
                      />
                    ) : savedUris.has(item.originalUri) ? (
                      <View style={styles.savedRow}>
                        <Feather name="check" size={14} color={Colors.light.white} />
                        <ThemedText style={styles.saveButtonText}>Saved</ThemedText>
                      </View>
                    ) : (
                      <ThemedText style={styles.saveButtonText}>Save</ThemedText>
                    )}
                  </Pressable>
                </>
              ) : (
                <View style={styles.failedCard}>
                  <Feather
                    name="alert-circle"
                    size={32}
                    color={Colors.light.error}
                  />
                  <ThemedText type="small" style={styles.errorText}>
                    {item.error || "Processing failed"}
                  </ThemedText>
                </View>
              )}
            </View>
          )}
        />
      </View>

      <View
        style={[
          styles.buttonContainer,
          { paddingBottom: insets.bottom + Spacing.md },
        ]}
      >
        {successfulResults.length > 0 && (
          <Button
            onPress={handleSaveAll}
            disabled={savedUris.size === successfulResults.length}
            style={styles.saveAllButton}
          >
            Save All to Gallery ({successfulResults.length - savedUris.size}{" "}
            remaining)
          </Button>
        )}

        <Pressable
          style={styles.secondaryButton}
          onPress={handleGenerateMore}
        >
          <ThemedText style={styles.secondaryButtonText}>
            Generate More
          </ThemedText>
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: "center",
  },
  subtitle: {
    marginTop: Spacing.xs,
    color: Colors.light.textSecondary,
  },
  grid: {
    paddingHorizontal: Spacing.xl,
  },
  resultCard: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.md,
    overflow: "hidden",
    backgroundColor: Colors.light.border,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  saveButton: {
    position: "absolute",
    bottom: Spacing.xs,
    left: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: Colors.light.primary,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
  },
  saveButtonDisabled: {
    backgroundColor: Colors.light.success,
  },
  saveButtonText: {
    color: Colors.light.white,
    fontSize: 12,
    fontWeight: "600",
  },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  failedCard: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: Spacing.md,
    backgroundColor: Colors.light.backgroundDefault,
  },
  errorText: {
    marginTop: Spacing.xs,
    color: Colors.light.error,
    textAlign: "center",
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  saveAllButton: {
    marginBottom: Spacing.sm,
  },
  secondaryButton: {
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.sm,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  secondaryButtonText: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
});
