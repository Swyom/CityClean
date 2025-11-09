import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;

export default function SignUpScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Terms agreement validation
    if (!agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before submitting.');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For demo purposes, we'll just navigate to home
      console.log('Sign up data:', formData);
      router.replace('/(tabs)/home');

    } catch (error) {
      Alert.alert('Sign Up Failed', error.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTermsToggle = () => {
    setAgreeToTerms(!agreeToTerms);
    if (errors.terms) {
      setErrors(prev => ({ ...prev, terms: '' }));
    }
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
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={scale(22)} color="#1B5E20" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/logo2.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitle}>Join CleanCity and start making a difference</Text>
          </View>

          {/* Main Form Container */}
          <View style={styles.mainFormContainer}>

            {/* Form Fields Container */}
            <View style={styles.fieldsContainer}>

              {/* Full Name Input */}
              <View style={styles.inputGroup}>
                <View style={[
                  styles.inputWrapper,
                  errors.fullName && styles.inputError
                ]}>
                  <MaterialIcons name="person-outline" size={scale(20)} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#999"
                    value={formData.fullName}
                    onChangeText={(text) => updateFormData('fullName', text)}
                    autoCapitalize="words"
                    autoComplete="name"
                    editable={!isLoading}
                  />
                </View>
                {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
              </View>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <View style={[
                  styles.inputWrapper,
                  errors.email && styles.inputError
                ]}>
                  <MaterialIcons name="email" size={scale(20)} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#999"
                    value={formData.email}
                    onChangeText={(text) => updateFormData('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    editable={!isLoading}
                  />
                </View>
                {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
              </View>

              {/* Phone Input */}
              <View style={styles.inputGroup}>
                <View style={[
                  styles.inputWrapper,
                  errors.phone && styles.inputError
                ]}>
                  <MaterialIcons name="phone-iphone" size={scale(20)} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#999"
                    value={formData.phone}
                    onChangeText={(text) => updateFormData('phone', text)}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    editable={!isLoading}
                  />
                </View>
                {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
              </View>

              {/* Password Input */}
              <View style={styles.inputGroup}>
                <View style={[
                  styles.inputWrapper,
                  errors.password && styles.inputError
                ]}>
                  <MaterialIcons name="lock-outline" size={scale(20)} color="#666" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={formData.password}
                    onChangeText={(text) => updateFormData('password', text)}
                    secureTextEntry={!showPassword}
                    autoComplete="password-new"
                    editable={!isLoading}
                  />
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    <MaterialIcons
                      name={showPassword ? "visibility" : "visibility-off"}
                      size={scale(20)}
                      color="#666"
                    />
                  </TouchableOpacity>
                </View>
                {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
              </View>

            </View>

            {/* Terms and Conditions */}
            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={handleTermsToggle}
                disabled={isLoading}
              >
                <View style={[
                  styles.checkboxBox,
                  agreeToTerms && styles.checkboxBoxChecked
                ]}>
                  {agreeToTerms && (
                    <MaterialIcons name="check" size={scale(14)} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and {' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
            {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.signupButton,
                (!agreeToTerms || isLoading) && styles.signupButtonDisabled
              ]}
              onPress={handleSignUp}
              disabled={!agreeToTerms || isLoading}
            >
              <Text style={styles.signupButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
                <Text style={[styles.loginLink, isLoading && styles.disabledLink]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>By continuing, you agree to our Terms of Service</Text>
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
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(10),
  },
  header: {
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 40,
    padding: scale(6),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  logoImage: {
    width: scale(150),
    height: scale(150),
  },
  welcomeText: {
    fontSize: scale(24),
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: verticalScale(4),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: scale(14),
    color: '#4CAF50',
    textAlign: 'center',
    paddingHorizontal: scale(15),
    lineHeight: scale(18),
    fontWeight: '500',
  },
  mainFormContainer: {
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
  fieldsContainer: {
    marginBottom: verticalScale(8),
  },
  inputGroup: {
    marginBottom: verticalScale(12),
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: scale(10),
    backgroundColor: '#F8FAFC',
    paddingHorizontal: scale(14),
    height: verticalScale(50),
  },
  inputError: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFF5F5',
  },
  inputIcon: {
    marginRight: scale(10),
  },
  input: {
    flex: 1,
    fontSize: scale(15),
    color: '#1E293B',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: scale(4),
  },
  errorText: {
    color: '#D32F2F',
    fontSize: scale(11),
    marginTop: scale(4),
    marginLeft: scale(2),
    fontWeight: '500',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: verticalScale(16),
    marginTop: verticalScale(8),
  },
  checkbox: {
    marginRight: scale(10),
  },
  checkboxBox: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(3),
    borderWidth: 1.5,
    borderColor: '#CCC',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  termsText: {
    flex: 1,
    fontSize: scale(13),
    color: '#666',
    lineHeight: scale(18),
  },
  termsLink: {
    color: '#2E7D32',
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: verticalScale(14),
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(16),
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.3,
    shadowRadius: scale(8),
    elevation: 6,
  },
  signupButtonDisabled: {
    backgroundColor: '#A5D6A7',
    shadowColor: 'transparent',
  },
  signupButtonText: {
    color: '#fff',
    fontSize: scale(15),
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#64748B',
    fontSize: scale(14),
    fontWeight: '500',
  },
  loginLink: {
    color: '#2E7D32',
    fontSize: scale(14),
    fontWeight: '600',
  },
  disabledLink: {
    color: '#A5D6A7',
  },
  footer: {
    alignItems: 'center',
    marginTop: verticalScale(15),
    paddingVertical: verticalScale(8),
  },
  footerText: {
    fontSize: scale(11),
    color: '#1d6a21ff',
    textAlign: 'center',
    fontWeight: '500',
  },
});