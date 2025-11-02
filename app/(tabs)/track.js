import { View, Text, StyleSheet } from 'react-native';

export default function TrackScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Track Reports</Text>
      <Text style={styles.subtitle}>Track Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 10,
  },
});