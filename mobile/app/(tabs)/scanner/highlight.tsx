// ./app/(tabs)/scanner/highlight.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { HighlightArea, FactCheckResponse } from "../../../types/navigation"; // Adjust path
import { Check } from "lucide-react-native";

import API_BASE_URL from "../../../config";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function HighlightScreen() {
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
  const router = useRouter();

  if (!imageUri) {
    return (
      <View style={styles.container}>
        <Text>Error: No image data provided</Text>
      </View>
    );
  }

  const [highlights, setHighlights] = useState<HighlightArea[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const startPoint = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    startPoint.current = { x: locationX, y: locationY };
    setIsDrawing(true);
  };

  const handleTouchMove = (event: any) => {
    if (!isDrawing || !startPoint.current) return;
    const { locationX, locationY } = event.nativeEvent;
    const newHighlight = {
      x: Math.min(startPoint.current.x, locationX),
      y: Math.min(startPoint.current.y, locationY),
      width: Math.abs(locationX - startPoint.current.x),
      height: Math.abs(locationY - startPoint.current.y),
    };
    setHighlights((prev) => [...prev.slice(0, -1), newHighlight]);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    startPoint.current = null;
  };

  const handleConfirm = async () => {
    if (highlights.length === 0) return;

    try {
      const formData = new FormData();
      formData.append("imageUri", imageUri);
      formData.append("highlights", JSON.stringify(highlights));

      const response = await fetch(`${API_BASE_URL}/api/tvbd`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("🔹 Server Response:", data);

      router.push({
        pathname: "/scanner/fact-check",
        params: {
          extractedText: data.extractedText,
          factCheckResults: JSON.stringify(data.factCheckResults),
          imageUri,
        },
      });
    } catch (error) {
      console.error("❌ Error sending data to backend:", error);
    }
  };

  // const handleConfirm = () => {
  //   setTimeout(async () => {
  //     const mockResponse: FactCheckResponse = {
  //       claim: "Is drinking water while standing bad for health?",
  //       verdict: "False",
  //       confidence: 95,
  //       explanation:
  //         "There is no scientific evidence supporting the claim that drinking water while standing is harmful to health. This is a common myth not supported by medical research.",
  //       sources: [
  //         {
  //           name: "World Health Organization",
  //           url: "https://www.who.int/water_sanitation_health",
  //           reliability: 98,
  //         },
  //         {
  //           name: "Medical Journal of Example",
  //           url: "https://example.com/research",
  //           reliability: 95,
  //         },
  //       ],
  //       timestamp: new Date().toISOString(),
  //     };

  //     router.push({
  //       pathname: "/scanner/fact-check",
  //       params: {
  //         query: "Process highlighted text",
  //         highlights: JSON.stringify(highlights),
  //         imageUri: imageUri as string,
  //         mockResponse: JSON.stringify(mockResponse),
  //       },
  //     });

  //     // No need to navigate back here since fact-check.tsx handles it
  //   }, 2000);
  // };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1a1a1a", "#000"]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.header}>
        <Text style={styles.title}>Highlight Text</Text>
        <Text style={styles.subtitle}>Drag to highlight text to recognize</Text>
      </View>
      <View
        style={styles.imageContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image source={{ uri: imageUri }} style={styles.image} />
        {highlights.map((highlight, index) => (
          <View
            key={index}
            style={[
              styles.highlight,
              {
                left: highlight.x,
                top: highlight.y,
                width: highlight.width,
                height: highlight.height,
              },
            ]}
          />
        ))}
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirm}
        disabled={highlights.length === 0}
      >
        <Check size={24} color="#fff" />
        <Text style={styles.buttonText}>Confirm Selection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 16,
    color: "#ccc",
    marginTop: 5,
  },
  imageContainer: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: SCREEN_WIDTH * 0.9,
    height: SCREEN_HEIGHT * 0.6,
    resizeMode: "contain",
  },
  highlight: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 0, 0.3)",
    borderWidth: 1,
    borderColor: "#ff0",
  },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    opacity: 1,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
});
