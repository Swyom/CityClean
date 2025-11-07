import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Image,
  TextInput,
  Alert,
  Linking
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@example.com',
    mobile: '+91 98765 43210',
    location: 'Punjab, India',
    farmSize: '5 acres',
    joinedDate: 'Jan 2023'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(userData);

  // Mock data for user stats
  const userStats = [
    { label: 'Crops Analyzed', value: '47', icon: 'leaf' },
    { label: 'Diseases Detected', value: '12', icon: 'bug' },
    { label: 'Harvests', value: '8', icon: 'trending-up' },
    { label: 'Expert Consults', value: '5', icon: 'people' }
  ];

  const helplineNumbers = [
    { id: 1, name: 'Krishi Saha Helpline', number: '1800-180-1551', hours: '24/7' }
  ];

  const handleEdit = () => {
    if (isEditing) {
      setUserData(editedData);
      Alert.alert('Success', 'Profile updated successfully!');
    }
    setIsEditing(!isEditing);
  };

  const handleCall = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleChat = () => {
    Alert.alert('Chat Support', 'Connecting you with Krishi Saha expert...');
  };

  const handleSubmitIssue = () => {
    Alert.alert('Submit Issue', 'Opening issue submission form...');
  };

  const handlePlotBuy = () => {
    Alert.alert('Plot Buy', 'Navigating to farming plots marketplace...');
  };

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
              <Text style={styles.headerTitle}>My Profile</Text>
              <Text style={styles.headerSubtitle}>Manage your account & get help</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEdit}
            >
              <LinearGradient
                colors={isEditing ? ['#4CAF50', '#66BB6A'] : ['#FFFFFF', '#F5F5F5']}
                style={styles.editGradient}
              >
                <Ionicons 
                  name={isEditing ? "checkmark" : "create-outline"} 
                  size={20} 
                  color={isEditing ? "#FFFFFF" : "#2E7D32"} 
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          {/* User Profile Section */}
          <View style={styles.section}>
            <LinearGradient
              colors={['#FFFFFF', '#F8FFF8']}
              style={styles.profileCard}
            >
              {/* Avatar */}
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#2E7D32', '#4CAF50']}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </Text>
                </LinearGradient>
                <TouchableOpacity style={styles.cameraButton}>
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              {/* User Info */}
              <View style={styles.userInfo}>
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.editInput}
                      value={editedData.name}
                      onChangeText={(text) => setEditedData({...editedData, name: text})}
                      placeholder="Full Name"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={editedData.email}
                      onChangeText={(text) => setEditedData({...editedData, email: text})}
                      placeholder="Email"
                      keyboardType="email-address"
                    />
                    <TextInput
                      style={styles.editInput}
                      value={editedData.mobile}
                      onChangeText={(text) => setEditedData({...editedData, mobile: text})}
                      placeholder="Mobile Number"
                      keyboardType="phone-pad"
                    />
                  </>
                ) : (
                  <>
                    <Text style={styles.userName}>{userData.name}</Text>
                    <View style={styles.userDetail}>
                      <Ionicons name="mail" size={16} color="#6C757D" />
                      <Text style={styles.userDetailText}>{userData.email}</Text>
                    </View>
                    <View style={styles.userDetail}>
                      <Ionicons name="call" size={16} color="#6C757D" />
                      <Text style={styles.userDetailText}>{userData.mobile}</Text>
                    </View>
                    <View style={styles.userDetail}>
                      <Ionicons name="location" size={16} color="#6C757D" />
                      <Text style={styles.userDetailText}>{userData.location}</Text>
                    </View>
                  </>
                )}
              </View>

              {/* User Stats */}
              <View style={styles.statsContainer}>
                {userStats.map((stat, index) => (
                  <View key={index} style={styles.statItem}>
                    <LinearGradient
                      colors={['#E8F5E8', '#C8E6C9']}
                      style={styles.statIcon}
                    >
                      <Ionicons name={stat.icon} size={20} color="#2E7D32" />
                    </LinearGradient>
                    <Text style={styles.statValue}>{stat.value}</Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* Krishi Saha Helpline Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Krishi Saha Helpline</Text>
            
            {helplineNumbers.map((helpline) => (
              <LinearGradient
                key={helpline.id}
                colors={['#FFFFFF', '#F8FFF8']}
                style={styles.helplineCard}
              >
                <View style={styles.helplineInfo}>
                  <View style={styles.helplineHeader}>
                    <Text style={styles.helplineName}>{helpline.name}</Text>
                    <View style={styles.hoursBadge}>
                      <Text style={styles.hoursText}>{helpline.hours}</Text>
                    </View>
                  </View>
                  <Text style={styles.helplineNumber}>{helpline.number}</Text>
                </View>
                
                <View style={styles.helplineActions}>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => handleCall(helpline.number.replace(/-/g, ''))}
                  >
                    <LinearGradient
                      colors={['#4CAF50', '#66BB6A']}
                      style={styles.callButtonGradient}
                    >
                      <Ionicons name="call" size={16} color="#FFFFFF" />
                      <Text style={styles.callButtonText}>Call</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  {helpline.id === 1 && (
                    <TouchableOpacity 
                      style={styles.chatButton}
                      onPress={handleChat}
                    >
                      <LinearGradient
                        colors={['#2196F3', '#42A5F5']}
                        style={styles.chatButtonGradient}
                      >
                        <Ionicons name="chatbubble" size={16} color="#FFFFFF" />
                        <Text style={styles.chatButtonText}>Chat</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            ))}
          </View>

          {/* Help & Support Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Help & Support</Text>
            
            <LinearGradient
              colors={['#FFFFFF', '#F8FFF8']}
              style={styles.helpCard}
            >
              <View style={styles.helpHeader}>
                <Ionicons name="help-circle" size={24} color="#2E7D32" />
                <Text style={styles.helpTitle}>Need Assistance?</Text>
              </View>
              
              <Text style={styles.helpDescription}>
                Having issues with crops, equipment, or need expert advice? Submit your query and our agricultural experts will assist you within 24 hours.
              </Text>
              
              <TouchableOpacity 
                style={styles.issueButton}
                onPress={handleSubmitIssue}
              >
                <LinearGradient
                  colors={['#FF9800', '#FFB74D']}
                  style={styles.issueButtonGradient}
                >
                  <Ionicons name="document-text" size={20} color="#FFFFFF" />
                  <Text style={styles.issueButtonText}>Submit Help Issue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Plot Buy for Farming Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Farming Plots</Text>
            
            <LinearGradient
              colors={['#FFFFFF', '#F8FFF8']}
              style={styles.plotCard}
            >
              <View style={styles.plotHeader}>
                <View>
                  <Text style={styles.plotTitle}>Available Farming Plots</Text>
                  <Text style={styles.plotSubtitle}>Rent or buy agricultural land</Text>
                </View>
                <Ionicons name="business" size={32} color="#2E7D32" />
              </View>
              
              <View style={styles.plotFeatures}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Verified Land Owners</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Soil Quality Reports</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Legal Documentation</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.featureText}>Water Availability</Text>
                </View>
              </View>
              
              <View style={styles.plotStats}>
                <View style={styles.plotStat}>
                  <Text style={styles.plotStatValue}>50+</Text>
                  <Text style={styles.plotStatLabel}>Plots Available</Text>
                </View>
                <View style={styles.plotStat}>
                  <Text style={styles.plotStatValue}>15</Text>
                  <Text style={styles.plotStatLabel}>Acres Avg.</Text>
                </View>
                <View style={styles.plotStat}>
                  <Text style={styles.plotStatValue}>₹25K</Text>
                  <Text style={styles.plotStatLabel}>Per Acre/Month</Text>
                </View>
              </View>
              
              <TouchableOpacity 
                style={styles.plotButton}
                onPress={handlePlotBuy}
              >
                <LinearGradient
                  colors={['#2E7D32', '#4CAF50']}
                  style={styles.plotButtonGradient}
                >
                  <Ionicons name="search" size={20} color="#FFFFFF" />
                  <Text style={styles.plotButtonText}>Browse Farming Plots</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionItem}>
                <LinearGradient
                  colors={['#E3F2FD', '#BBDEFB']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="calendar" size={24} color="#1565C0" />
                </LinearGradient>
                <Text style={styles.actionText}>Crop Calendar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem}>
                <LinearGradient
                  colors={['#E8F5E8', '#C8E6C9']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="analytics" size={24} color="#2E7D32" />
                </LinearGradient>
                <Text style={styles.actionText}>My Reports</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem}>
                <LinearGradient
                  colors={['#FFF3E0', '#FFE0B2']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="settings" size={24} color="#E65100" />
                </LinearGradient>
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionItem}>
                <LinearGradient
                  colors={['#FCE4EC', '#F8BBD0']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="log-out" size={24} color="#C2185B" />
                </LinearGradient>
                <Text style={styles.actionText}>Logout</Text>
              </TouchableOpacity>
            </View>
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
  editButton: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  editGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
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
  // Profile Card Styles
  profileCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
  },
  userDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  userDetailText: {
    fontSize: 14,
    color: '#6C757D',
  },
  editInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E8F5E8',
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#6C757D',
    textAlign: 'center',
  },
  // Helpline Styles
  helplineCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  helplineInfo: {
    flex: 1,
  },
  helplineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  helplineName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    flex: 1,
  },
  hoursBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hoursText: {
    fontSize: 10,
    color: '#4CAF50',
    fontWeight: '600',
  },
  helplineNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
  },
  helplineActions: {
    flexDirection: 'row',
    gap: 8,
  },
  callButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  callButtonGradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  chatButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  chatButtonGradient: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  // Help Card Styles
  helpCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  helpDescription: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 20,
    marginBottom: 20,
  },
  issueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  issueButtonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  issueButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // Plot Card Styles
  plotCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  plotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  plotTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  plotSubtitle: {
    fontSize: 14,
    color: '#6C757D',
  },
  plotFeatures: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#495057',
  },
  plotStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  plotStat: {
    alignItems: 'center',
  },
  plotStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  plotStatLabel: {
    fontSize: 10,
    color: '#6C757D',
    textAlign: 'center',
  },
  plotButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  plotButtonGradient: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  plotButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  // Quick Actions Styles
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 16,
  },
  actionGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default ProfileScreen;