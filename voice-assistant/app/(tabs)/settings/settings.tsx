import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

/**
 * Settings Screen
 * 
 * Provides user configuration options for the app:
 * 1. Voice Recognition settings
 * 2. Fact Checking preferences
 * 3. App information
 * 
 * Current Implementation:
 * - Static UI with non-functional controls
 * - Demonstrates layout and interaction patterns
 * 
 * Future Enhancements:
 * - Persistent settings storage
 * - Integration with voice recognition services
 * - User preference synchronization
 */
export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000']}
        style={StyleSheet.absoluteFill}
      />
      
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice Recognition</Text>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Wake Word Sensitivity</Text>
          <Text style={styles.settingValue}>Medium</Text>
        </View>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Recognition Language</Text>
          <Text style={styles.settingValue}>English</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Fact Checking</Text>
        <TouchableOpacity style={styles.setting}>
          <Text style={styles.settingText}>Trusted Sources</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.setting}>
          <Text style={styles.settingText}>Minimum Confidence</Text>
          <Text style={styles.settingValue}>70%</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.setting}>
          <Text style={styles.settingText}>Response Language</Text>
          <Text style={styles.settingValue}>English</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.setting}>
          <Text style={styles.settingText}>Privacy Policy</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.setting}>
          <Text style={styles.settingText}>Terms of Service</Text>
          <ChevronRight size={20} color="#666" />
        </TouchableOpacity>
        <View style={styles.setting}>
          <Text style={styles.settingText}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 15,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
  },
  settingValue: {
    fontSize: 16,
    color: '#666',
  },
});