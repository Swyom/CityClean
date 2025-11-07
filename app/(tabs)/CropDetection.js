import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  Image,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');

const CropDetectionScreen = ({ navigation }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  // Request camera permission on component mount
  useEffect(() => {
    (async () => {
      if (!permission) {
        await requestPermission();
      }
    })();
  }, []);

  // Mock disease data
  const diseaseData = {
    diseaseName: 'Leaf Rust',
    confidence: '92%',
    plantType: 'Wheat',
    severity: 'Moderate',
    description: 'Leaf rust appears as small, circular or oval brown pustules on the leaf surface. It can significantly reduce yield if not treated promptly.',
    treatment: {
      organic: [
        'Neem oil spray every 7-10 days',
        'Baking soda solution (1 tbsp per gallon)',
        'Garlic and chili pepper spray'
      ],
      chemical: [
        'Propiconazole (Tilt) - 200ml per acre',
        'Tebuconazole (Folicur) - 500ml per acre',
        'Azoxystrobin (Amistar) - 300ml per acre'
      ],
      preventive: [
        'Plant resistant varieties',
        'Ensure proper spacing for air circulation',
        'Avoid overhead irrigation'
      ]
    },
    timeline: 'Treat within 3-5 days for best results'
  };

  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const permissionResult = await requestPermission();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Camera permission is needed to capture plant images.');
        return;
      }
    }
    setIsCameraActive(true);
  };

  const handleCaptureImage = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
        });
        setCapturedImage(photo.uri);
        setIsCameraActive(false);
        
        // Simulate analysis
        setTimeout(() => {
          setAnalysisResult(diseaseData);
          Alert.alert('Analysis Complete', 'Disease detected: Leaf Rust (92% confidence)');
        }, 1500);
      } catch (error) {
        Alert.alert('Error', 'Failed to capture image. Please try again.');
        console.error('Camera error:', error);
      }
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setIsCameraActive(false);
  };

  const handleCloseCamera = () => {
    setIsCameraActive(false);
  };

  // Camera View
  if (isCameraActive && permission?.granted) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="back"
        >
          <View style={styles.cameraOverlay}>
            <TouchableOpacity 
              style={styles.closeCameraButton}
              onPress={handleCloseCamera}
            >
              <Ionicons name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.cameraFrame}>
              <View style={styles.cameraFrameBorder} />
              <Text style={styles.cameraFrameText}>Position plant within frame</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.captureButtonCamera}
              onPress={handleCaptureImage}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <LinearGradient 
      colors={['#E8F5E9', '#F1F8E9', '#F9FBE7']} 
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
        
        {/* Header */}
        <LinearGradient
          colors={['#2E7D32', '#4CAF50']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerTitle}>Crop Disease Detection</Text>
              <Text style={styles.headerSubtitle}>AI-powered plant health analysis</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <LinearGradient
                colors={['#FFFFFF', '#F5F5F5']}
                style={styles.profileGradient}
              >
                <Text style={styles.profileIcon}>👤</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* Camera Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Capture Plant Image</Text>
            <LinearGradient
              colors={['#FFFFFF', '#F8FFF8']}
              style={styles.card}
            >
              {!capturedImage ? (
                <View style={styles.cameraPlaceholder}>
                  <View style={styles.cameraIconContainer}>
                    <Ionicons name="camera" size={50} color="#4CAF50" />
                  </View>
                  <Text style={styles.cameraText}>Ready to capture plant image</Text>
                  <Text style={styles.cameraSubtext}>Ensure good lighting and clear focus on leaves</Text>
                  
                  <TouchableOpacity 
                    style={styles.captureButton}
                    onPress={handleOpenCamera}
                  >
                    <LinearGradient
                      colors={['#2E7D32', '#4CAF50']}
                      style={styles.captureButtonGradient}
                    >
                      <Ionicons name="camera-outline" size={24} color="#FFFFFF" />
                      <Text style={styles.captureButtonText}>Capture Photo</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  {!permission?.granted && (
                    <Text style={styles.permissionText}>
                      Camera permission required to capture photos
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.imageSection}>
                  <Text style={styles.imageSectionTitle}>Captured Plant Image</Text>
                  <View style={styles.imageContainer}>
                    <Image 
                      source={{ uri: capturedImage }} 
                      style={styles.capturedImage}
                      resizeMode="cover"
                    />
                    <View style={styles.imageOverlay}>
                      <TouchableOpacity 
                        style={styles.retakeButton}
                        onPress={handleRetakePhoto}
                      >
                        <Ionicons name="refresh" size={20} color="#FFFFFF" />
                        <Text style={styles.retakeText}>Retake</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  {analysisResult && (
                    <LinearGradient
                      colors={['#4CAF50', '#66BB6A']}
                      style={styles.analysisBadge}
                    >
                      <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                      <Text style={styles.analysisBadgeText}>
                        Analysis Complete - {analysisResult.confidence} Confidence
                      </Text>
                    </LinearGradient>
                  )}
                </View>
              )}
            </LinearGradient>
          </View>

          {/* Analysis Results */}
          {analysisResult && (
            <>
              {/* Disease Identification */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Disease Analysis</Text>
                <LinearGradient
                  colors={['#FFFFFF', '#F8FFF8']}
                  style={styles.card}
                >
                  <View style={styles.diseaseHeader}>
                    <View>
                      <Text style={styles.diseaseName}>{analysisResult.diseaseName}</Text>
                      <Text style={styles.plantType}>{analysisResult.plantType}</Text>
                    </View>
                    <LinearGradient
                      colors={['#FF9800', '#FFB74D']}
                      style={styles.severityBadge}
                    >
                      <Text style={styles.severityText}>{analysisResult.severity} Severity</Text>
                    </LinearGradient>
                  </View>

                  <Text style={styles.descriptionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>{analysisResult.description}</Text>

                  <View style={styles.urgencyAlert}>
                    <Ionicons name="time" size={20} color="#E65100" />
                    <Text style={styles.urgencyText}>{analysisResult.timeline}</Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Treatment Recommendations */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Treatment Recommendations</Text>

                {/* Organic Treatments */}
                <View style={styles.treatmentCard}>
                  <LinearGradient
                    colors={['#E8F5E8', '#C8E6C9']}
                    style={styles.treatmentHeader}
                  >
                    <Ionicons name="leaf" size={20} color="#2E7D32" />
                    <Text style={styles.treatmentTitle}>Organic Solutions</Text>
                  </LinearGradient>
                  <View style={styles.treatmentContent}>
                    {analysisResult.treatment.organic.map((treatment, index) => (
                      <View key={index} style={styles.treatmentItem}>
                        <View style={styles.bulletPoint} />
                        <Text style={styles.treatmentText}>{treatment}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Chemical Treatments */}
                <View style={styles.treatmentCard}>
                  <LinearGradient
                    colors={['#E3F2FD', '#BBDEFB']}
                    style={styles.treatmentHeader}
                  >
                    <Ionicons name="flask" size={20} color="#1565C0" />
                    <Text style={styles.treatmentTitle}>Chemical Treatments</Text>
                  </LinearGradient>
                  <View style={styles.treatmentContent}>
                    {analysisResult.treatment.chemical.map((treatment, index) => (
                      <View key={index} style={styles.treatmentItem}>
                        <View style={[styles.bulletPoint, { backgroundColor: '#1565C0' }]} />
                        <Text style={styles.treatmentText}>{treatment}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Preventive Measures */}
                <View style={styles.treatmentCard}>
                  <LinearGradient
                    colors={['#FFF3E0', '#FFE0B2']}
                    style={styles.treatmentHeader}
                  >
                    <Ionicons name="shield-checkmark" size={20} color="#E65100" />
                    <Text style={styles.treatmentTitle}>Preventive Measures</Text>
                  </LinearGradient>
                  <View style={styles.treatmentContent}>
                    {analysisResult.treatment.preventive.map((measure, index) => (
                      <View key={index} style={styles.treatmentItem}>
                        <View style={[styles.bulletPoint, { backgroundColor: '#E65100' }]} />
                        <Text style={styles.treatmentText}>{measure}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={styles.section}>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.secondaryButton}>
                    <LinearGradient
                      colors={['#6D4C41', '#8D6E63']}
                      style={styles.buttonGradient}
                    >
                      <Ionicons name="document-text" size={20} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Save Report</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.primaryButton}>
                    <LinearGradient
                      colors={['#2E7D32', '#4CAF50']}
                      style={styles.buttonGradient}
                    >
                      <Ionicons name="cart" size={20} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Buy Medicines</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}

          {/* Tips Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Capture Tips</Text>
            <LinearGradient
              colors={['#E3F2FD', '#BBDEFB']}
              style={styles.tipsCard}
            >
              <View style={styles.tipItem}>
                <Ionicons name="sunny" size={20} color="#1565C0" />
                <Text style={styles.tipText}>Good natural lighting</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="crop" size={20} color="#1565C0" />
                <Text style={styles.tipText}>Focus on affected leaves</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="scan" size={20} color="#1565C0" />
                <Text style={styles.tipText}>Clear, close-up shots work best</Text>
              </View>
              <View style={styles.tipItem}>
                <Ionicons name="color-palette" size={20} color="#1565C0" />
                <Text style={styles.tipText}>Include healthy parts for comparison</Text>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E8F5E8',
    textAlign: 'center',
    marginTop: 2,
  },
  profileButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  profileGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  // Camera Section Styles
  cameraPlaceholder: {
    alignItems: 'center',
    padding: 20,
  },
  cameraIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cameraText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  cameraSubtext: {
    fontSize: 14,
    color: '#6C757D',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionText: {
    fontSize: 12,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  captureButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    width: '80%',
  },
  captureButtonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  captureButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // Image Section Styles
  imageSection: {
    alignItems: 'center',
  },
  imageSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 16,
    textAlign: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  capturedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  retakeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  retakeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  analysisBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  analysisBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Disease Analysis Styles
  diseaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  diseaseName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  plantType: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  severityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    marginBottom: 16,
  },
  urgencyAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
    gap: 8,
  },
  urgencyText: {
    fontSize: 13,
    color: '#E65100',
    fontWeight: '500',
    flex: 1,
  },
  // Treatment Styles
  treatmentCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  treatmentContent: {
    backgroundColor: '#FFFFFF',
    padding: 16,
  },
  treatmentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginTop: 6,
  },
  treatmentText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
    flex: 1,
  },
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#6D4C41',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  // Tips Section
  tipsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#1565C0',
    fontWeight: '500',
    flex: 1,
  },
  // Camera Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
  },
  closeCameraButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  cameraFrame: {
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  cameraFrameBorder: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  cameraFrameText: {
    color: '#FFFFFF',
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  captureButtonCamera: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 50,
    padding: 4,
    marginBottom: 30,
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
  },
});

export default CropDetectionScreen;