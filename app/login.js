import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)/home');
    }, 1500);
  };

  return (
    <LinearGradient
      colors={['#F8FDF8', '#afddb3ff', '#C8E6C9']}
      style={styles.gradientContainer}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#F8FDF8" />
        
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue your clean journey</Text>
          </View>

          {/* Form Container */}
          <View style={styles.formContainer}>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="email" size={scale(22)} color="#2E7D32" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <MaterialIcons name="lock-outline" size={scale(22)} color="#2E7D32" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  autoCorrect={false}
                  editable={!isLoading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={scale(22)}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity style={styles.forgotPassword} disabled={isLoading}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                (!email || !password || isLoading) && styles.loginButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={!email || !password || isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
              {!isLoading && (
                <MaterialIcons name="arrow-forward" size={scale(20)} color="#fff" />
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/signup')} disabled={isLoading}>
                <Text style={[styles.signupLink, isLoading && styles.disabledLink]}>Create Account</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>CleanCity © 2024</Text>
            <Text style={styles.footerSubtext}>Making cities cleaner, together</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(10),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(25),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  logoImage: {
    width: scale(150),
    height: scale(150),
  },
  welcomeText: {
    fontSize: scale(26),
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: verticalScale(6),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(15),
    color: '#4CAF50',
    textAlign: 'center',
    paddingHorizontal: scale(15),
    lineHeight: scale(20),
    fontWeight: '500',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: scale(16),
    padding: scale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.08,
    shadowRadius: scale(12),
    elevation: 6,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  inputGroup: {
    marginBottom: verticalScale(16),
  },
  label: {
    fontSize: scale(15),
    fontWeight: '600',
    marginBottom: verticalScale(8),
    color: '#1B5E20',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: scale(12),
    backgroundColor: '#F8FAFC',
    paddingHorizontal: scale(16),
    height: verticalScale(52),
  },
  inputIcon: {
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    fontSize: scale(15),
    color: '#1E293B',
    fontWeight: '500',
    paddingVertical: verticalScale(8),
  },
  eyeIcon: {
    padding: scale(4),
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: verticalScale(20),
  },
  forgotPasswordText: {
    color: '#2E7D32',
    fontSize: scale(14),
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    marginBottom: verticalScale(20),
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(8),
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: '#A5D6A7',
    shadowColor: 'transparent',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: scale(16),
    fontWeight: '600',
    marginRight: scale(8),
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  signupText: {
    color: '#64748B',
    fontSize: scale(14),
    fontWeight: '500',
  },
  signupLink: {
    color: '#2E7D32',
    fontSize: scale(14),
    fontWeight: '600',
  },
  disabledLink: {
    color: '#A5D6A7',
  },
  footer: {
    alignItems: 'center',
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(10),
  },
  footerText: {
    fontSize: scale(12),
    color: '#1f7122ff',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: scale(11),
    color: '#39963dff',
    marginTop: scale(4),
    fontWeight: '500',
  },
});