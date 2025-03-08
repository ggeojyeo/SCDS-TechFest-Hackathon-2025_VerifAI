// ./app/(tabs)/scanner/fact-check.tsx
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { HighlightArea, FactCheckResponse } from "../../../types/navigation"; // Adjust path
import { StyleSheet } from "react-native";
import { ArrowLeft } from "lucide-react-native";

export default function FactCheckScreen() {
  const { query, highlights, imageUri, mockResponse } = useLocalSearchParams<{
    query: string;
    highlights: string;
    imageUri?: string;
    mockResponse: string;
  }>();
  const router = useRouter();

  const parsedHighlights: HighlightArea[] = highlights
    ? JSON.parse(highlights)
    : [];
  const parsedResponse: FactCheckResponse = mockResponse
    ? JSON.parse(mockResponse)
    : null;

  useEffect(() => {
    const timer = setTimeout(
      () => router.replace("/(tabs)/scanner/scannerScreen"),
      30000
    );
    return () => clearTimeout(timer);
  }, [router]);

  const handleBackToScanner = () => {
    router.replace("/(tabs)/scanner/scannerScreen");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {parsedResponse ? (
          <View style={styles.resultCard}>
            <Text style={styles.claimText}>{parsedResponse.claim}</Text>
            <View style={styles.verdictRow}>
              <Text
                style={[
                  styles.verdictText,
                  parsedResponse.verdict === "True"
                    ? styles.verdictTrue
                    : styles.verdictFalse,
                ]}
              >
                {parsedResponse.verdict}
              </Text>
              <Text style={styles.confidenceText}>
                {parsedResponse.confidence}% confidence
              </Text>
            </View>
            <Text style={styles.explanationText}>
              {parsedResponse.explanation}
            </Text>
            <View style={styles.sourcesContainer}>
              <Text style={styles.sourcesTitle}>Sources:</Text>
              {parsedResponse.sources.map((source, index) => (
                <View key={index} style={styles.sourceItem}>
                  <Text style={styles.sourceName}>{source.name}</Text>
                  <Text style={styles.sourceReliability}>
                    Reliability: {source.reliability}%
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToScanner}
            >
              <ArrowLeft size={20} color="#fff" />
              <Text style={styles.backButtonText}>Back to Scanner</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.waitingText}>No results to display</Text>
        )}
        {imageUri && (
          <Text style={styles.waitingText}>Image URI: {imageUri}</Text>
        )}
        {parsedHighlights.length > 0 && (
          <Text style={styles.waitingText}>
            Highlighted Areas: {JSON.stringify(parsedHighlights)}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  resultCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 20,
    borderRadius: 12,
    width: "100%",
    marginTop: 20,
  },
  claimText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  verdictRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  verdictText: {
    fontSize: 14,
    fontWeight: "bold",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  verdictTrue: {
    backgroundColor: "#10b981",
    color: "#fff",
  },
  verdictFalse: {
    backgroundColor: "#ef4444",
    color: "#fff",
  },
  confidenceText: {
    color: "#999",
    fontSize: 14,
  },
  explanationText: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  sourcesContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 15,
  },
  sourcesTitle: {
    color: "#999",
    fontSize: 14,
    marginBottom: 10,
  },
  sourceItem: {
    marginBottom: 8,
  },
  sourceName: {
    color: "#10b981",
    fontSize: 14,
  },
  sourceReliability: {
    color: "#666",
    fontSize: 12,
    marginLeft: 15,
  },
  waitingText: {
    color: "#666",
    fontSize: 16,
    marginTop: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: "center",
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
  },
});
