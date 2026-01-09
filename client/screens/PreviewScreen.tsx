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
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/Button";
import { Colors, Spacing, BorderRadius } from "@/constants/theme";
import { RootStackParamList } from "@/navigation/RootStackNavigator";
import { getApiUrl } from "@/lib/query-client";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Preview">;
type PreviewRouteProp = RouteProp<RootStackParamList, "Preview">;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = SCREEN_WIDTH * 0.85;

export default function PreviewScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<PreviewRouteProp>();
  const { imageUri } = route.params;

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderButton
          onPress={() => navigation.goBack()}
          pressOpacity={0.7}
        >
          <ThemedText style={styles.headerButton}>Retake</ThemedText>
        </HeaderButton>
      ),
    });
  }, [navigation]);

  const handleGenerate = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: "product_photo.jpg",
        type: "image/jpeg",
      } as unknown as Blob);

      const apiUrl = getApiUrl();
      const endpoint = `${apiUrl}api/amazon-main`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);
      
      let response: Response;
      try {
        response = await fetch(endpoint, {
          method: "POST",
          body: formData,
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to process image");
      }

      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64data = reader.result as string;
        navigation.replace("Result", {
          resultUri: base64data,
          originalUri: imageUri,
        });
      };
      
      reader.onerror = () => {
        throw new Error("Failed to read processed image");
      };
      
      reader.readAsDataURL(blob);
    } catch (err) {
      let errorMessage = "An unexpected error occurred";
      
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Request timed out. Please try again.";
        } else if (err.message.includes("Network request failed") || err.message.includes("TypeError")) {
          errorMessage = "Unable to connect to server. Please check your connection and try again.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      
      if (Platform.OS !== "web") {
        Alert.alert("Processing Failed", errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
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
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      ) : null}

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleGenerate}
          disabled={isProcessing}
          style={styles.generateButton}
        >
          {isProcessing ? (
            <View style={styles.loadingContent}>
              <ActivityIndicator color={Colors.light.white} size="small" />
              <ThemedText style={styles.loadingText}>Processing...</ThemedText>
            </View>
          ) : (
            "Generate Amazon Main"
          )}
        </Button>
      </View>

      {isProcessing ? (
        <View style={styles.processingInfo}>
          <ThemedText type="small" style={styles.processingText}>
            AI is removing the background and creating your Amazon-ready image...
          </ThemedText>
        </View>
      ) : null}
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
    backgroundColor: Colors.light.backgroundDefault,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  buttonContainer: {
    width: "100%",
    marginTop: Spacing.lg,
  },
  generateButton: {
    width: "100%",
  },
  loadingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
  },
  loadingText: {
    color: Colors.light.white,
    fontWeight: "600",
  },
  errorContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.light.error + "15",
    borderRadius: BorderRadius.sm,
    width: "100%",
  },
  errorText: {
    color: Colors.light.error,
    textAlign: "center",
  },
  processingInfo: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  processingText: {
    color: Colors.light.textSecondary,
    textAlign: "center",
  },
});
