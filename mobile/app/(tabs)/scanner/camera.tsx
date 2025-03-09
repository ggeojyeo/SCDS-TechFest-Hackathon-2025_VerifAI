// ./app/(tabs)/scanner/camera.tsx
import { View, Button } from "react-native";
import { Stack, useRouter } from "expo-router"; // Use expo-router for navigation
import * as ImagePicker from "expo-image-picker"; // For camera access
import { useEffect } from "react";

export default function CameraScreen() {
  const router = useRouter(); // Hook for navigation in expo-router

  // Request camera permissions on mount
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera permissions to make this work!");
      }
    })();
  }, []);

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        console.log("Navigating to HighlightScreen with params:", { imageUri });
        router.push({
          pathname: "/(tabs)/scanner/highlight",
          params: { imageUri },
        });
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      alert("Failed to take photo. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Take Photo" onPress={takePhoto} />
    </View>
  );
}
