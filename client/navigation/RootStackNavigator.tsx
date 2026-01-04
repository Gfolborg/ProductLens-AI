import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useScreenOptions } from "@/hooks/useScreenOptions";
import CameraScreen from "@/screens/CameraScreen";
import PreviewScreen from "@/screens/PreviewScreen";
import ResultScreen from "@/screens/ResultScreen";
import BatchSelectionScreen from "@/screens/BatchSelectionScreen";
import BatchQueueScreen from "@/screens/BatchQueueScreen";

export type RootStackParamList = {
  Camera: undefined;
  Preview: { imageUri: string };
  Result: { resultUri: string; originalUri: string };
  BatchSelection: { imageUris: string[] };
  BatchQueue: { imageUris: string[] };
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
        name="BatchSelection"
        component={BatchSelectionScreen}
        options={{ headerTitle: "Review Selection" }}
      />
      <Stack.Screen
        name="BatchQueue"
        component={BatchQueueScreen}
        options={{ headerTitle: "Processing Queue" }}
      />
    </Stack.Navigator>
  );
}
