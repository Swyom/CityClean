import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, Text, Image, StyleSheet } from 'react-native';

function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/logo3.png')} 
        style={styles.logo} 
        resizeMode="contain"
      />
      <Text style={styles.title}>CleanCity</Text>
      <Text style={styles.subtitle}>Making Cities Cleaner, Together</Text>
    </View>
  );
}

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    // Show splash for 2 seconds then go to login
    setTimeout(() => {
      router.replace('/login');
    }, 2000);
  }, []);

  // Show splash screen while redirecting
  return <SplashScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
  },
  logo: {
    width: 220,
    height: 220,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
});