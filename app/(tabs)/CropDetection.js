import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CropDetectionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crop Health Detection</Text>
      <Text style={styles.text}>AI-based crop health details will appear here.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8F5E9', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1565C0', marginBottom: 10 },
  text: { color: '#333', fontSize: 16, textAlign: 'center', marginHorizontal: 20, marginBottom: 20 },
  button: { backgroundColor: '#1565C0', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default CropDetectionScreen;
