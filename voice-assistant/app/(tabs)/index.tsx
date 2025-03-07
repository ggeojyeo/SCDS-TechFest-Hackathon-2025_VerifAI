import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, MicOff, Loader as Loader2 } from 'lucide-react-native';
import { Audio } from 'expo-av';
import type { Recording } from 'expo-av/build/Audio';
import Animated, { 
  useAnimatedStyle, 
  withSpring,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import type { FactCheckResponse } from '@/types/api';

export default function VerifyScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<FactCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recordingRef = useRef<Recording | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup recording on unmount
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync();
      }
    };
  }, []);

  // Animated pulse effect for the microphone button
  const pulseStyle = useAnimatedStyle(() => {
    if (!isRecording) return { transform: [{ scale: 1 }] };
    return {
      transform: [
        {
          scale: withRepeat(
            withSequence(
              withSpring(1.2),
              withSpring(1)
            ),
            -1,
            true
          ),
        },
      ],
    };
  });

  const startRecording = async () => {
    try {
      setError(null);
      setResult(null);
      
      // Request permissions
      const permission = await Audio.requestPermissionsAsync();
      if (!permission.granted) {
        setError('Microphone permission not granted');
        return;
      }

      // Prepare recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      setError('Failed to start recording');
      console.error('Recording error:', err);
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);
      
      // Stop recording
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;

      // Create form data for upload
      const formData = new FormData();
      formData.append('audio', {
        uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      });

      // In production, replace with your actual API endpoint
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // Simulate API response for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResponse: FactCheckResponse = {
        claim: "Is drinking water while standing bad for health?",
        verdict: "False",
        confidence: 95,
        explanation: "There is no scientific evidence supporting the claim that drinking water while standing is harmful to health. This is a common myth not supported by medical research.",
        sources: [
          {
            name: "World Health Organization",
            url: "https://www.who.int/water_sanitation_health",
            reliability: 98
          },
          {
            name: "Medical Journal of Example",
            url: "https://example.com/research",
            reliability: 95
          }
        ],
        timestamp: new Date().toISOString()
      };
      
      setResult(mockResponse);
    } catch (err) {
      setError('Failed to process recording');
      console.error('Processing error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.content}>
        <Text style={styles.title}>VerifyAI</Text>
        <Text style={styles.subtitle}>
          Press and hold to record your question
        </Text>

        <Animated.View style={[styles.micWrapper, pulseStyle]}>
          <TouchableOpacity
            onPress={handleToggleRecording}
            style={[
              styles.micButton,
              isRecording && styles.micButtonActive
            ]}>
            {isProcessing ? (
              <Loader2 size={32} color="#fff" className="animate-spin" />
            ) : isRecording ? (
              <MicOff size={32} color="#fff" />
            ) : (
              <Mic size={32} color="#fff" />
            )}
          </TouchableOpacity>
        </Animated.View>

        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : result ? (
          <View style={styles.resultCard}>
            <Text style={styles.claimText}>{result.claim}</Text>
            <View style={styles.verdictRow}>
              <Text style={[
                styles.verdictText,
                result.verdict === 'True' ? styles.verdictTrue : styles.verdictFalse
              ]}>
                {result.verdict}
              </Text>
              <Text style={styles.confidenceText}>
                {result.confidence}% confidence
              </Text>
            </View>
            <Text style={styles.explanationText}>{result.explanation}</Text>
            <View style={styles.sourcesContainer}>
              <Text style={styles.sourcesTitle}>Sources:</Text>
              {result.sources.map((source, index) => (
                <View key={index} style={styles.sourceItem}>
                  <Text style={styles.sourceName}>• {source.name}</Text>
                  <Text style={styles.sourceReliability}>
                    Reliability: {source.reliability}%
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.waitingText}>
            {isProcessing ? 'Processing your question...' : 'Waiting for your question...'}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 60,
  },
  micWrapper: {
    marginBottom: 40,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 5,
  },
  micButtonActive: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },
  errorCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginTop: 20,
  },
  claimText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  verdictRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  verdictText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  verdictTrue: {
    backgroundColor: '#10b981',
    color: '#fff',
  },
  verdictFalse: {
    backgroundColor: '#ef4444',
    color: '#fff',
  },
  confidenceText: {
    color: '#999',
    fontSize: 14,
  },
  explanationText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  sourcesContainer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 15,
  },
  sourcesTitle: {
    color: '#999',
    fontSize: 14,
    marginBottom: 10,
  },
  sourceItem: {
    marginBottom: 8,
  },
  sourceName: {
    color: '#10b981',
    fontSize: 14,
  },
  sourceReliability: {
    color: '#666',
    fontSize: 12,
    marginLeft: 15,
  },
  waitingText: {
    color: '#666',
    fontSize: 16,
    marginTop: 20,
  },
});