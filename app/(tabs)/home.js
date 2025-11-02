import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');
const isSmallScreen = height < 700;

const CityCleanHome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />

      {/* Header Section */}
      <LinearGradient
        colors={['#2E7D32', '#4CAF50']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Icon name="recycle" size={isSmallScreen ? 24 : 28} color="#fff" />
            <Text style={styles.logoText}>CityClean</Text>
          </View>

          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Icon name="account" size={isSmallScreen ? 16 : 20} color="#fff" />
            </View>
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>Hello, User!</Text>
              <Text style={styles.subWelcomeText}>Welcome back</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Your efforts make our city shine</Text>
          <Text style={styles.welcomeSubtitle}>
            Thank you for contributing to a cleaner environment
          </Text>
        </View>

        {/* Impact Section */}
        <Text style={styles.sectionTitle}>Your Impact</Text>

        <View style={styles.impactContainer}>
          <View style={styles.impactCard}>
            <LinearGradient
              colors={['#2196F3', '#21CBF3']}
              style={styles.impactGradient}
            >
              <Icon name="clipboard-check" size={isSmallScreen ? 28 : 32} color="#fff" />
              <Text style={styles.impactNumber}>35</Text>
              <Text style={styles.impactLabel}>Reports</Text>
            </LinearGradient>
          </View>

          <View style={styles.impactCard}>
            <LinearGradient
              colors={['#FF9800', '#FFB74D']}
              style={styles.impactGradient}
            >
              <Icon name="star-circle" size={isSmallScreen ? 28 : 32} color="#fff" />
              <Text style={styles.impactNumber}>1240</Text>
              <Text style={styles.impactLabel}>Points</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Action Cards */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionCard} activeOpacity={0.9}>
            <LinearGradient
              colors={['#2E7D32', '#4CAF50']}
              style={styles.actionGradient}
            >
              <Icon name="alert-circle-outline" size={isSmallScreen ? 32 : 40} color="#fff" />
              <Text style={styles.actionTitle}>Report an Issue</Text>
              <Text style={styles.actionDescription}>
                Found a problem? Report it quickly
              </Text>
              <View style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Report Now</Text>
                <Icon name="arrow-right" size={isSmallScreen ? 14 : 16} color="#2E7D32" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} activeOpacity={0.9}>
            <LinearGradient
              colors={['#1565C0', '#42A5F5']}
              style={styles.actionGradient}
            >
              <Icon name="progress-clock" size={isSmallScreen ? 32 : 40} color="#fff" />
              <Text style={styles.actionTitle}>Track Complaints</Text>
              <Text style={styles.actionDescription}>
                Monitor the status of your report issues
              </Text>
              <View style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Status</Text>
                <Icon name="arrow-right" size={isSmallScreen ? 14 : 16} color="#1565C0" />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} activeOpacity={0.9}>
            <LinearGradient
              colors={['#9C27B0', '#E91E63']}
              style={styles.actionGradient}
            >
              <Icon name="gift" size={isSmallScreen ? 32 : 40} color="#fff" />
              <Text style={styles.actionTitle}>Rewards & Benefits</Text>
              <Text style={styles.actionDescription}>
                Earn points and redeem exciting rewards for your contributions
              </Text>
              <View style={styles.actionButton}>
                <Text style={styles.actionButtonText}>View Rewards</Text>
                <Icon name="arrow-right" size={isSmallScreen ? 14 : 16} color="#9C27B0" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>This Month</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Issues Fixed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Active Reports</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Community Points</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 13,
    paddingTop: isSmallScreen ? 20 : 60,
    paddingBottom: isSmallScreen ? 10 : 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTextContainer: {
    marginLeft: 8,
  },
  avatar: {
    width: isSmallScreen ? 36 : 40,
    height: isSmallScreen ? 36 : 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    color: '#fff',
    fontSize: isSmallScreen ? 14 : 16,
    fontWeight: '600',
  },
  subWelcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: isSmallScreen ? 10 : 12,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: isSmallScreen ? 20 : 30,
  },
  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    marginBottom: isSmallScreen ? 20 : 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
    textAlign: 'center',
    lineHeight: isSmallScreen ? 22 : 24,
  },
  welcomeSubtitle: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 18 : 20,
  },
  sectionTitle: {
    fontSize: isSmallScreen ? 20 : 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isSmallScreen ? 12 : 16,
    marginTop: isSmallScreen ? 4 : 0,
  },
  impactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: isSmallScreen ? 20 : 24,
    gap: 12,
  },
  impactCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    minHeight: isSmallScreen ? 120 : 140,
  },
  impactGradient: {
    padding: isSmallScreen ? 16 : 20,
    alignItems: 'center',
    borderRadius: 16,
    justifyContent: 'center',
    flex: 1,
  },
  impactNumber: {
    fontSize: isSmallScreen ? 28 : 32,
    fontWeight: 'bold',
    color: '#fff',
    marginVertical: isSmallScreen ? 6 : 8,
  },
  impactLabel: {
    fontSize: isSmallScreen ? 13 : 14,
    color: '#fff',
    fontWeight: '600',
  },
  actionsContainer: {
    marginBottom: isSmallScreen ? 20 : 24,
    gap: isSmallScreen ? 12 : 16,
  },
  actionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  actionGradient: {
    padding: isSmallScreen ? 20 : 24,
    borderRadius: 16,
  },
  actionTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: isSmallScreen ? 8 : 12,
    marginBottom: isSmallScreen ? 6 : 8,
  },
  actionDescription: {
    fontSize: isSmallScreen ? 13 : 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: isSmallScreen ? 16 : 20,
    lineHeight: isSmallScreen ? 18 : 20,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: isSmallScreen ? 10 : 12,
    paddingHorizontal: isSmallScreen ? 16 : 20,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#333',
    fontWeight: '600',
    marginRight: 6,
    fontSize: isSmallScreen ? 13 : 14,
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: isSmallScreen ? 16 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: isSmallScreen ? 10 : 0,
  },
  statsTitle: {
    fontSize: isSmallScreen ? 16 : 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: isSmallScreen ? 12 : 16,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  statNumber: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: isSmallScreen ? 11 : 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: isSmallScreen ? 14 : 16,
  },
  statDivider: {
    width: 1,
    height: isSmallScreen ? 30 : 40,
    backgroundColor: '#E0E0E0',
  },
});

export default CityCleanHome;