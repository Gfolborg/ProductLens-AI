import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import CameraScreen from "@/screens/CameraScreen";
import PreviewScreen from "@/screens/PreviewScreen";
import ResultScreen from "@/screens/ResultScreen";
import BatchPreviewScreen from "@/screens/BatchPreviewScreen";
import BatchProcessingScreen from "@/screens/BatchProcessingScreen";
import BatchResultScreen from "@/screens/BatchResultScreen";

export type RootStackParamList = {
  Camera: undefined;
  Preview: { imageUri: string };
  Result: { resultUri: string; originalUri: string };

  // Batch flow
  BatchPreview: { imageUris: string[] };
  BatchProcessing: { imageUris: string[] };
  BatchResult: {
    results: Array<{
      originalUri: string;
      resultUri: string | null;
      error?: string;
    }>;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootStackNavigator() {
  const screenOptions = useScreenOptions({ transparent: false });

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Preview"
        component={PreviewScreen}
        options={{ headerTitle: "Preview" }}
      />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ headerTitle: "Amazon Ready" }}
      />
      <Stack.Screen
        name="BatchPreview"
        component={BatchPreviewScreen}
        options={{ headerTitle: "Batch Preview" }}
      />
      <Stack.Screen
        name="BatchProcessing"
        component={BatchProcessingScreen}
        options={{ headerTitle: "Processing", headerBackVisible: false }}
      />
      <Stack.Screen
        name="BatchResult"
        component={BatchResultScreen}
        options={{ headerTitle: "Batch Results", headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
}
