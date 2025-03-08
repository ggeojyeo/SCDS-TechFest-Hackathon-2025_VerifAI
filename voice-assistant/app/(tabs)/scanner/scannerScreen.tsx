// ./app/(tabs)/scanner/scannerScreen.tsx
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useCameraPermissions } from "expo-camera";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Image as ImageIcon, Link, Camera } from "lucide-react-native";
import { useRouter } from "expo-router";
import { FactCheckResponse } from "../../../types/navigation"; // Adjust path

export default function ScannerScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [urlInputVisible, setUrlInputVisible] = useState(false); // Toggle for URL input section
  const [urlInput, setUrlInput] = useState("");

  useEffect(() => {
    console.log("ScannerScreen mounted, requesting permissions");
    async function checkPermissions() {
      if (!permission || !permission.granted) {
        await requestPermission();
      }
    }
    checkPermissions();
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Gallery permission not granted");
      }
    })();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(isLoading ? 0.95 : 1) }],
  }));

  const processImage = async (uri: string): Promise<void> => {
    setIsLoading(true);
    try {
      console.log("Navigating to HighlightScreen with params:", {
        imageUri: uri,
      });
      router.push({
        pathname: "/scanner/highlight",
        params: { imageUri: uri },
      });
    } catch (error) {
      console.error("Error in processImage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakePhoto = async () => {
    if (!permission?.granted) {
      const response = await requestPermission();
      if (!response.granted) {
        console.log("Camera permission not granted");
        return;
      }
    }

    setIsLoading(true);
    try {
      const photo = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!photo.canceled && photo.assets.length > 0) {
        await processImage(photo.assets[0].uri);
      }
    } catch (error) {
      console.error("Error in handleTakePhoto:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImage = async () => {
    setIsLoading(true);
    try {
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!image.canceled && image.assets.length > 0) {
        await processImage(image.assets[0].uri);
      }
    } catch (error) {
      console.error("Error in handleUploadImage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteLink = () => {
    console.log("Toggling URL input section");
    setUrlInputVisible(!urlInputVisible); // Toggle visibility
  };

  const handleSubmitUrl = () => {
    const query = urlInput.trim();
    if (!query) {
      console.log("No URL provided");
      setUrlInputVisible(false);
      setUrlInput("");
      return;
    }
    setUrlInputVisible(false);
    setIsLoading(true);
    setTimeout(() => {
      try {
        const mockResponse: FactCheckResponse = {
          claim: "Is drinking water while standing bad for health?",
          verdict: "False",
          confidence: 95,
          explanation:
            "There is no scientific evidence supporting the claim that drinking water while standing is harmful to health. This is a common myth not supported by medical research.",
          sources: [
            {
              name: "World Health Organization",
              url: "https://www.who.int/water_sanitation_health",
              reliability: 98,
            },
            {
              name: "Medical Journal of Example",
              url: "https://example.com/research",
              reliability: 95,
            },
          ],
          timestamp: new Date().toISOString(),
        };
        console.log("Navigating to fact-check with query:", query);
        router.push({
          pathname: "/scanner/fact-check",
          params: { query, mockResponse: JSON.stringify(mockResponse) },
        });
      } catch (error) {
        console.error("Error in handleSubmitUrl:", error);
      } finally {
        setIsLoading(false);
        setUrlInput("");
        setTimeout(
          () => router.replace("/(tabs)/scanner/scannerScreen"),
          30000
        );
      }
    }, 2000);
  };

  const handleCancelUrl = () => {
    console.log("Cancel URL input");
    setUrlInputVisible(false);
    setUrlInput("");
  };

  console.log("Rendering ScannerScreen with 3 buttons");

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a1a", "#000"]}
        style={StyleSheet.absoluteFill}
      />
      <Text style={styles.title}>Text Recognition</Text>
      <Text style={styles.subheading}>Select an Option</Text>
      <View style={styles.buttonContainer}>
        <Animated.View style={[styles.animatedWrapper, animatedStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleTakePhoto}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Camera size={24} color="#fff" />
                <Text style={styles.buttonText}>Take Photo</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
        <Animated.View style={[styles.animatedWrapper, animatedStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPress={handlePasteLink}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Link size={24} color="#fff" />
                <Text style={styles.buttonText}>
                  {urlInputVisible ? "Hide URL Input" : "Paste URL"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
        {urlInputVisible && (
          <Animated.View style={[styles.animatedWrapper, animatedStyle]}>
            <View style={styles.urlInputContainer}>
              <TextInput
                style={styles.urlInput}
                placeholder="https://example.com"
                placeholderTextColor="#999"
                value={urlInput}
                onChangeText={(text) => {
                  console.log("URL input changed:", text);
                  setUrlInput(text);
                }}
                autoCapitalize="none"
                keyboardType="url"
                editable={true}
              />
              <View style={styles.urlButtonContainer}>
                <Pressable
                  style={[styles.urlButton, styles.cancelButton]}
                  onPress={handleCancelUrl}
                >
                  <Text style={styles.urlButtonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.urlButton, styles.submitButton]}
                  onPress={handleSubmitUrl}
                >
                  <Text style={styles.urlButtonText}>Submit</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        )}
        <Animated.View style={[styles.animatedWrapper, animatedStyle]}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleUploadImage}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <ImageIcon size={24} color="#fff" />
                <Text style={styles.buttonText}>Upload Image</Text>
              </>
            )}
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  subheading: {
    fontSize: 18,
    color: "#999",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  animatedWrapper: {
    marginBottom: 20,
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  urlInputContainer: {
    backgroundColor: "#1a1a1a",
    padding: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fff",
  },
  urlInput: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#666",
  },
  urlButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  urlButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ef4444",
  },
  submitButton: {
    backgroundColor: "#10b981",
  },
  urlButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
