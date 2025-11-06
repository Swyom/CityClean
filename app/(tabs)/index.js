import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  // Soil data with trends
  const soilData = {
    moisture: { value: '65%', trend: 'up', optimal: true, icon: '💧' },
    phLevel: { value: '6.8', trend: 'stable', optimal: true, icon: '🧪' },
    nitrogen: { value: 'Medium', trend: 'down', optimal: true, icon: '🌿' },
    phosphorus: { value: 'High', trend: 'stable', optimal: true, icon: '⚡' },
    potassium: { value: 'Low', trend: 'down', optimal: false, icon: '🛡️' },
  };

  // Weather forecast data
  const weatherForecast = [
    { day: 'Today', icon: '☀️', temp: '32°C', condition: 'Sunny', precipitation: '0%' },
    { day: 'Tomorrow', icon: '⛅', temp: '30°C', condition: 'Partly Cloudy', precipitation: '10%' },
    { day: 'Wed', icon: '🌧️', temp: '28°C', condition: 'Light Rain', precipitation: '70%' },
    { day: 'Thu', icon: '☀️', temp: '31°C', condition: 'Sunny', precipitation: '0%' },
    { day: 'Fri', icon: '🌤️', temp: '29°C', condition: 'Mostly Sunny', precipitation: '5%' },
  ];

  // Soil health progress data
  const soilHealthProgress = [
    { parameter: 'Moisture', value: 65, optimal: 60, color: '#4CAF50' },
    { parameter: 'pH Level', value: 6.8, optimal: 6.5, color: '#2196F3' },
    { parameter: 'Nitrogen', value: 60, optimal: 70, color: '#FF9800' },
    { parameter: 'Phosphorus', value: 85, optimal: 75, color: '#9C27B0' },
    { parameter: 'Potassium', value: 45, optimal: 65, color: '#F44336' },
  ];

  const recentActivities = [
    { id: 1, action: 'Soil test completed', time: '2 hours ago', icon: '🔍' },
    { id: 2, action: 'Irrigation system activated', time: '4 hours ago', icon: '💦' },
    { id: 3, action: 'Weather alert: Rain expected', time: '1 day ago', icon: '⚠️' },
  ];

  // Function to render progress bars
  const renderProgressBar = (parameter, value, optimal, color) => {
    const percentage = Math.min(value, 100);
    const isOptimal = value >= optimal;
    
    return (
      <View key={parameter} style={styles.progressItem}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{parameter}</Text>
          <Text style={[
            styles.progressValue,
            !isOptimal && styles.progressValueWarning
          ]}>
            {parameter === 'pH Level' ? value : `${value}%`}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <LinearGradient
            colors={isOptimal ? ['#4CAF50', '#66BB6A'] : [color, '#FF8A65']}
            style={[
              styles.progressBar, 
              { width: `${percentage}%` }
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={[styles.optimalMarker, { left: `${optimal}%` }]} />
        </View>
        <Text style={styles.optimalText}>
          Optimal: {parameter === 'pH Level' ? optimal : `${optimal}%`}
        </Text>
      </View>
    );
  };

  return (
    <LinearGradient 
      colors={['#E8F5E9', '#F1F8E9', '#F9FBE7']} 
      style={styles.gradientBackground}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#E8F5E9" />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Section */}
          <LinearGradient
            colors={['#2E7D32', '#4CAF50']}
            style={styles.header}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.greeting}>Good Morning, Farmer! 👋</Text>
                <Text style={styles.subtitle}>Welcome to your farming dashboard</Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
                activeOpacity={0.7}
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

          {/* Soil Health Graphical Analysis */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Soil Health Analysis</Text>
              <LinearGradient
                colors={['#E8F5E8', '#C8E6C9']}
                style={styles.statusBadge}
              >
                <Text style={styles.statusText}>Optimal 🌟</Text>
              </LinearGradient>
            </View>
            <LinearGradient
              colors={['#FFFFFF', '#F8FFF8']}
              style={styles.card}
            >
              <View style={styles.progressContainer}>
                {soilHealthProgress.map(item => 
                  renderProgressBar(item.parameter, item.value, item.optimal, item.color)
                )}
              </View>

              <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
                <LinearGradient
                  colors={['#2E7D32', '#4CAF50']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.primaryButtonText}>📊 Download Full Report</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Weather Forecast */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Weather Forecast</Text>
              <Text style={styles.weatherUpdate}>Updated: 08:00 AM</Text>
            </View>
            <LinearGradient
              colors={['#E3F2FD', '#BBDEFB']}
              style={styles.card}
            >
              <View style={styles.weatherHeader}>
                <View style={styles.locationContainer}>
                  <Text style={styles.weatherLocation}>📍 Farm Location</Text>
                </View>
                <LinearGradient
                  colors={['#2E7D32', '#4CAF50']}
                  style={styles.tempBadge}
                >
                  <Text style={styles.currentTemp}>32°C</Text>
                </LinearGradient>
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.weatherScroll}
              >
                {weatherForecast.map((day, index) => (
                  <LinearGradient
                    key={index}
                    colors={['#FFFFFF', '#F5F5F5']}
                    style={styles.weatherDay}
                  >
                    <Text style={styles.weatherDayText}>{day.day}</Text>
                    <Text style={styles.weatherIcon}>{day.icon}</Text>
                    <Text style={styles.weatherTemp}>{day.temp}</Text>
                    <Text style={styles.weatherCondition}>{day.condition}</Text>
                    <LinearGradient
                      colors={['#E3F2FD', '#BBDEFB']}
                      style={styles.precipitation}
                    >
                      <Text style={styles.precipitationText}>{day.precipitation}</Text>
                    </LinearGradient>
                  </LinearGradient>
                ))}
              </ScrollView>
              
              <LinearGradient
                colors={['#FFF3E0', '#FFE0B2']}
                style={styles.weatherAlert}
              >
                <Text style={styles.alertIcon}>⚠️</Text>
                <Text style={styles.alertText}>
                  Light rain expected on Wednesday. Plan irrigation accordingly.
                </Text>
              </LinearGradient>
            </LinearGradient>
          </View>

          {/* Quick Soil Metrics Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Soil Summary</Text>
            <View style={styles.metricsGrid}>
              {Object.entries(soilData).map(([key, data]) => (
                <LinearGradient
                  key={key}
                  colors={data.optimal ? ['#FFFFFF', '#F8FFF8'] : ['#FFFFFF', '#FFEBEE']}
                  style={[
                    styles.metricCard,
                    !data.optimal && styles.metricCardWarning
                  ]}
                >
                  <Text style={styles.metricIcon}>{data.icon}</Text>
                  <Text style={styles.metricName}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Text>
                  <Text style={[
                    styles.metricValue, 
                    !data.optimal && styles.metricValueWarning
                  ]}>
                    {data.value}
                  </Text>
                  <View style={styles.trendContainer}>
                    <LinearGradient
                      colors={data.trend === 'up' ? ['#4CAF50', '#66BB6A'] : data.trend === 'down' ? ['#F44336', '#EF5350'] : ['#9E9E9E', '#BDBDBD']}
                      style={styles.trendBadge}
                    >
                      <Text style={styles.trendIcon}>
                        {data.trend === 'up' ? '↗' : data.trend === 'down' ? '↘' : '→'}
                      </Text>
                    </LinearGradient>
                    <Text style={styles.trendText}>
                      {data.trend === 'up' ? 'Increasing' : data.trend === 'down' ? 'Decreasing' : 'Stable'}
                    </Text>
                  </View>
                </LinearGradient>
              ))}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <LinearGradient
              colors={['#FFFFFF', '#F8FFF8']}
              style={styles.card}
            >
              {recentActivities.map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <LinearGradient
                    colors={['#E8F5E8', '#C8E6C9']}
                    style={styles.activityIcon}
                  >
                    <Text style={styles.activityIconText}>{activity.icon}</Text>
                  </LinearGradient>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>{activity.action}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                  </View>
                </View>
              ))}
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
    paddingBottom: 20,
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
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#E8F5E8',
    marginTop: 4,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  card: {
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  weatherUpdate: {
    fontSize: 12,
    color: '#6C757D',
  },
  // Progress Bar Styles
  progressContainer: {
    marginBottom: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  progressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4CAF50',
  },
  progressValueWarning: {
    color: '#F44336',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    marginBottom: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  optimalMarker: {
    position: 'absolute',
    top: -2,
    width: 3,
    height: 12,
    backgroundColor: '#FF9800',
    borderRadius: 1.5,
  },
  optimalText: {
    fontSize: 11,
    color: '#6C757D',
    textAlign: 'right',
  },
  // Weather Styles
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1565C0',
  },
  tempBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  currentTemp: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  weatherScroll: {
    marginBottom: 16,
  },
  weatherDay: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 75,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  weatherDayText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 8,
  },
  weatherIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  weatherTemp: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  weatherCondition: {
    fontSize: 11,
    color: '#1565C0',
    textAlign: 'center',
    marginBottom: 6,
  },
  precipitation: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  precipitationText: {
    fontSize: 10,
    color: '#1565C0',
    fontWeight: '600',
  },
  weatherAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  alertIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  alertText: {
    fontSize: 13,
    color: '#E65100',
    flex: 1,
    fontWeight: '500',
  },
  // Metrics Grid Styles
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 48) / 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  metricCardWarning: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  metricIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  metricName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C757D',
    marginBottom: 8,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 8,
  },
  metricValueWarning: {
    color: '#F44336',
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  trendIcon: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  trendText: {
    fontSize: 10,
    color: '#6C757D',
  },
  // Button Styles
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  // Activity Styles
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 4,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIconText: {
    fontSize: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: '#6C757D',
  },
});

export default HomeScreen;