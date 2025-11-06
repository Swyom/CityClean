import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MarketScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Market Prices</Text>
      <Text style={styles.text}>Daily crop market price updates will appear here.</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF3E0', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#FF6F00', marginBottom: 10 },
  text: { color: '#333', fontSize: 16, textAlign: 'center', marginHorizontal: 20, marginBottom: 20 },
  button: { backgroundColor: '#FF6F00', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

export default MarketScreen;
