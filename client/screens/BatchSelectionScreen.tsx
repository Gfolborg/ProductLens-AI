import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { ImageThumbnail } from "@/components/ImageThumbnail";
import { SwipeableCard } from "@/components/SwipeableCard";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { BatchSelectionCopy } from "@/constants/copy";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "BatchSelection">;
type BatchSelectionRouteProp = RouteProp<RootStackParamList, "BatchSelection">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const THUMBNAIL_SIZE = (SCREEN_WIDTH - Spacing.xl * 2 - Spacing.md * 2) / 3;

export default function BatchSelectionScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<BatchSelectionRouteProp>();
  const { imageUris: initialUris } = route.params;

  const [imageUris, setImageUris] = useState<string[]>(initialUris);

  const handleRemoveImage = (index: number) => {
    setImageUris(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddMore = () => {
    navigation.goBack();
  };

  const handleProcessAll = () => {
    if (imageUris.length > 0) {
      navigation.navigate("BatchQueue", { imageUris });
    }
  };

  const canAddMore = imageUris.length < 10;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <ThemedText type="h4" style={styles.title}>
          {BatchSelectionCopy.title(imageUris.length)}
        </ThemedText>
        <ThemedText type="small" style={styles.subtitle}>
          {BatchSelectionCopy.subtitle}
        </ThemedText>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.gridContainer,
          { paddingBottom: insets.bottom + Spacing.xl + 120 },
        ]}
      >
        {imageUris.map((uri, index) => (
          <SwipeableCard
            key={`${uri}-${index}`}
            direction="left"
            threshold={100}
            onDelete={() => handleRemoveImage(index)}
            deleteText={BatchSelectionCopy.swipe.delete}
            deleteColor={Colors.light.error}
            style={styles.thumbnailWrapper}
          >
            <ImageThumbnail
              uri={uri}
              size={THUMBNAIL_SIZE}
              onRemove={() => handleRemoveImage(index)}
            />
          </SwipeableCard>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.xl }]}>
        {canAddMore && (
          <Pressable style={styles.addMoreButton} onPress={handleAddMore}>
            <Feather name="plus-circle" size={20} color={Colors.light.primary} />
            <ThemedText style={styles.addMoreText}>{BatchSelectionCopy.addMore}</ThemedText>
          </Pressable>
        )}

        <View style={styles.buttonContainer}>
          <Button
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.secondaryButton}
          >
            {BatchSelectionCopy.cancelButton}
          </Button>

          <Button
            onPress={handleProcessAll}
            disabled={imageUris.length === 0}
            variant="primary"
            style={styles.primaryButton}
          >
            {BatchSelectionCopy.processButton}
          </Button>
        </View>
      </View>
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
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    color: Colors.light.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.md,
    padding: Spacing.xl,
  },
  thumbnailWrapper: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.light.white,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },
  addMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  addMoreText: {
    color: Colors.light.primary,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  primaryButton: {
    flex: 1,
  },
  secondaryButton: {
    flex: 1,
  },
});
