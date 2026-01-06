import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";

import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "BatchPreview"
>;
type RouteProps = RouteProp<RootStackParamList, "BatchPreview">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = (SCREEN_WIDTH - Spacing.xl * 3) / 2;

export default function BatchPreviewScreen() {
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { imageUris } = route.params;

  const [selectedImages, setSelectedImages] = useState<string[]>(imageUris);

  const handleRemoveImage = (uri: string) => {
    setSelectedImages((prev) => prev.filter((img) => img !== uri));
  };

  const handleGenerate = () => {
    if (selectedImages.length === 0) return;
    navigation.navigate("BatchProcessing", { imageUris: selectedImages });
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.content, { paddingTop: Spacing.md }]}>
        <View style={styles.header}>
          <ThemedText type="h4">
            {selectedImages.length} {selectedImages.length === 1 ? "Image" : "Images"} Selected
          </ThemedText>
          <ThemedText type="small" style={styles.subtitle}>
            Tap X to remove images • Max 10 images
          </ThemedText>
        </View>

        <FlatList
          data={selectedImages}
          numColumns={2}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <View style={styles.imageCard}>
              <Image source={{ uri: item }} style={styles.image} />
              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemoveImage(item)}
              >
                <Feather name="x" size={16} color={Colors.light.white} />
              </Pressable>
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
        <Button onPress={handleGenerate} disabled={selectedImages.length === 0}>
          Generate {selectedImages.length} Amazon Main{" "}
          {selectedImages.length === 1 ? "Image" : "Images"}
        </Button>
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
  },
  subtitle: {
    marginTop: Spacing.xs,
    color: Colors.light.textSecondary,
  },
  grid: {
    paddingHorizontal: Spacing.xl,
  },
  imageCard: {
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
    resizeMode: "cover",
  },
  removeButton: {
    position: "absolute",
    top: Spacing.xs,
    right: Spacing.xs,
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
});
