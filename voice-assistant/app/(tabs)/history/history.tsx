import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

/**
 * History Screen
 * 
 * Displays a list of previous fact-checks performed by the user.
 * Currently using static data, but in a production environment this would:
 * 1. Fetch from a backend API/database
 * 2. Support pagination for large lists
 * 3. Allow filtering and searching
 * 4. Store data in local storage for offline access
 */

// Example data structure for fact-check history
// In production, this would come from your backend
const DUMMY_HISTORY = [
  {
    id: '1',
    claim: 'Drinking water standing up is bad for your health',
    verdict: 'False',
    confidence: 95,
    date: '2024-02-20',
    sources: ['WHO Guidelines', 'Medical Journal of Example'],
  },
  {
    id: '2',
    claim: 'The Great Wall of China is visible from space',
    verdict: 'False',
    confidence: 98,
    date: '2024-02-19',
    sources: ['NASA Reports', 'Satellite Imagery Database'],
  },
];

export default function HistoryScreen() {
  // Render individual history item
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.claim}>{item.claim}</Text>
      <View style={styles.verdictRow}>
        <Text style={[
          styles.verdict,
          item.verdict === 'True' ? styles.verdictTrue : styles.verdictFalse
        ]}>
          {item.verdict}
        </Text>
        <Text style={styles.confidence}>{item.confidence}% confidence</Text>
      </View>
      <Text style={styles.date}>{item.date}</Text>
      
      {/* Sources list - new addition */}
      <View style={styles.sourcesContainer}>
        <Text style={styles.sourcesTitle}>Sources:</Text>
        {item.sources.map((source, index) => (
          <Text key={index} style={styles.source}>• {source}</Text>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000']}
        style={StyleSheet.absoluteFill}
      />
      
      <Text style={styles.title}>Fact Check History</Text>
      
      <FlatList
        data={DUMMY_HISTORY}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
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
  list: {
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  claim: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
  },
  verdictRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  verdict: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 4,
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
  confidence: {
    color: '#999',
    fontSize: 14,
  },
  date: {
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
  sourcesContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  sourcesTitle: {
    color: '#999',
    fontSize: 14,
    marginBottom: 5,
  },
  source: {
    color: '#10b981',
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 2,
  },
});