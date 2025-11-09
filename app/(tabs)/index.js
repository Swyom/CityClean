import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  StatusBar,
  Alert,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const AgricultureApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // API Keys
  const NEWS_API_KEY = 'e432746d2b6b49afae88335182323aca';
  const WEATHER_API_KEY = 'bd5e378503939ddaee76f12ad7a97608';

  useEffect(() => {
    fetchData();
    animateScreen();
  }, []);

  const animateScreen = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch Weather Data
      const weatherResponse = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=28.6139,77.2090&aqi=no`
      );
      
      if (!weatherResponse.ok) {
        throw new Error('Weather API failed');
      }
      
      const weatherResult = await weatherResponse.json();
      
      // Fetch News Data
      const newsResponse = await fetch(
        `https://newsapi.org/v2/everything?q=agriculture+farming&language=en&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
      );
      
      let newsResult;
      if (newsResponse.ok) {
        newsResult = await newsResponse.json();
      } else {
        // Fallback news data if API fails
        newsResult = {
          articles: [
            {
              title: 'Global Wheat Production Reaches New High',
              source: { name: 'Agricultural Times' },
              publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
              title: 'Sustainable Farming Practices Gain Traction',
              source: { name: 'Farm Innovation' },
              publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            },
            {
              title: 'New Irrigation Technology Saves 30% Water',
              source: { name: 'Tech Farming' },
              publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            }
          ]
        };
      }

      // Transform weather data
      const transformedWeatherData = {
        temperature: `${Math.round(weatherResult.current.temp_c)}°C`,
        condition: weatherResult.current.condition.text,
        humidity: `${weatherResult.current.humidity}%`,
        rainChance: `${weatherResult.current.precip_mm > 0 ? '30%' : '10%'}`,
        windSpeed: `${weatherResult.current.wind_kph} km/h`,
        soilType: 'Loamy Soil',
        soilMoisture: '42%',
        temperatureTrend: weatherResult.current.temp_c > 25 ? 'rising' : 'stable',
        pressure: `${weatherResult.current.pressure_mb} hPa`,
        location: weatherResult.location.name,
        feelsLike: `${Math.round(weatherResult.current.feelslike_c)}°C`,
        uvIndex: weatherResult.current.uv,
        visibility: `${weatherResult.current.vis_km} km`
      };

      // Transform news data
      const transformedNewsData = newsResult.articles.slice(0, 3).map(article => ({
        title: article.title,
        location: article.source.name,
        time: getTimeAgo(article.publishedAt),
        category: getCategoryFromTitle(article.title)
      }));

      setWeatherData(transformedWeatherData);
      setNewsData(transformedNewsData);
      setLoading(false);
      setRefreshing(false);

    } catch (error) {
      console.error('API Error:', error);
      // Fallback to mock data if APIs fail
      const mockWeatherData = {
        temperature: '30°C',
        condition: 'Partly Cloudy',
        humidity: '65%',
        rainChance: '20%',
        windSpeed: '10 km/h',
        soilType: 'Loamy Soil',
        soilMoisture: '42%',
        temperatureTrend: 'rising',
        pressure: '1013 hPa',
        location: 'New Delhi',
        feelsLike: '32°C',
        uvIndex: 5,
        visibility: '10 km'
      };

      const mockNewsData = [
        {
          title: 'Global Wheat Production Reaches New High',
          location: 'International Grain Council',
          time: '2 hours ago',
          category: 'Market News'
        },
        {
          title: 'Sustainable Farming Practices Gain Traction',
          location: 'Agricultural Innovation Summit',
          time: '5 hours ago',
          category: 'Innovation'
        },
        {
          title: 'New Irrigation Technology Saves 30% Water',
          location: 'FarmTech Conference',
          time: '1 day ago',
          category: 'Technology'
        }
      ];

      setWeatherData(mockWeatherData);
      setNewsData(mockNewsData);
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getCategoryFromTitle = (title) => {
    if (title.toLowerCase().includes('tech') || title.toLowerCase().includes('irrigation')) 
      return 'Technology';
    if (title.toLowerCase().includes('market') || title.toLowerCase().includes('production')) 
      return 'Market News';
    return 'Innovation';
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const WeatherMetric = ({ icon, value, label }) => (
    <View style={styles.metricContainer}>
      <LinearGradient
        colors={['#2E8B57', '#3CB371']}
        style={styles.metricIcon}
      >
        <Text style={styles.metricIconText}>{icon}</Text>
      </LinearGradient>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );

  const NewsCard = ({ title, location, time, category, index }) => (
    <View style={styles.newsCard}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FFF8']}
        style={styles.newsCardGradient}
      >
        <View style={styles.newsHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
          <Text style={styles.newsTime}>{time}</Text>
        </View>
        <Text style={styles.newsTitle}>{title}</Text>
        <Text style={styles.newsLocation}>{location}</Text>
        <View style={styles.newsFooter}>
          <TouchableOpacity style={styles.readMoreBtn}>
            <Text style={styles.readMoreText}>Read More</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  // Improved Soil Health Gauge Component
  const SoilHealthGauge = ({ title, value, level, color, optimalRange, unit }) => (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9']}
      style={styles.gaugeCard}
    >
      <View style={styles.gaugeHeader}>
        <Text style={styles.gaugeTitle}>{title}</Text>
        <View style={[styles.levelBadge, { backgroundColor: color }]}>
          <Text style={styles.levelBadgeText}>{level}</Text>
        </View>
      </View>
      
      <View style={styles.gaugeWrapper}>
        <View style={styles.gaugeBackground}>
          <LinearGradient
            colors={['#EF4444', '#F59E0B', '#10B981']}
            style={styles.gaugeGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          />
          <View style={[styles.gaugeNeedle, { left: `${value}%` }]} />
          <View style={styles.gaugeMarker} />
        </View>
        
        <View style={styles.gaugeLabels}>
          <Text style={styles.gaugeLabel}>0%</Text>
          <Text style={styles.gaugeLabel}>50%</Text>
          <Text style={styles.gaugeLabel}>100%</Text>
        </View>
      </View>
      
      <View style={styles.gaugeInfo}>
        <Text style={styles.gaugeValue}>{value}{unit}</Text>
        <Text style={styles.optimalRange}>Optimal: {optimalRange}</Text>
      </View>
    </LinearGradient>
  );

  // Improved Nutrient Chart Component
  const NutrientChart = () => (
    <LinearGradient
      colors={['#F8FAFC', '#F1F5F9']}
      style={styles.nutrientChartCard}
    >
      <Text style={styles.chartTitle}>Nutrient Levels</Text>
      
      <View style={styles.chartBars}>
        <View style={styles.nutrientBar}>
          <View style={styles.barInfo}>
            <Text style={styles.nutrientName}>Nitrogen (N)</Text>
            <Text style={styles.nutrientValue}>85%</Text>
          </View>
          <View style={styles.barContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={[styles.barFill, { width: '85%' }]}
            />
          </View>
          <Text style={[styles.nutrientStatus, styles.highStatus]}>High</Text>
        </View>
        
        <View style={styles.nutrientBar}>
          <View style={styles.barInfo}>
            <Text style={styles.nutrientName}>Phosphorus (P)</Text>
            <Text style={styles.nutrientValue}>60%</Text>
          </View>
          <View style={styles.barContainer}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={[styles.barFill, { width: '60%' }]}
            />
          </View>
          <Text style={[styles.nutrientStatus, styles.mediumStatus]}>Medium</Text>
        </View>
        
        <View style={styles.nutrientBar}>
          <View style={styles.barInfo}>
            <Text style={styles.nutrientName}>Potassium (K)</Text>
            <Text style={styles.nutrientValue}>75%</Text>
          </View>
          <View style={styles.barContainer}>
            <LinearGradient
              colors={['#4ECDC4', '#2E8B57']}
              style={[styles.barFill, { width: '75%' }]}
            />
          </View>
          <Text style={[styles.nutrientStatus, styles.optimalStatus]}>Optimal</Text>
        </View>
      </View>
      
      <View style={styles.chartLegend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>High</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>Medium</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4ECDC4' }]} />
          <Text style={styles.legendText}>Optimal</Text>
        </View>
      </View>
    </LinearGradient>
  );

  // Soil Health Score Component
  const SoilHealthScore = () => (
    <LinearGradient
      colors={['#2E8B57', '#3CB371']}
      style={styles.healthScoreCard}
    >
      <Text style={styles.scoreTitle}>Soil Health Score</Text>
      <View style={styles.scoreCircle}>
        <Text style={styles.scoreValue}>78</Text>
        <Text style={styles.scoreLabel}>/100</Text>
      </View>
      <Text style={styles.scoreDescription}>Good - Well balanced soil composition</Text>
      <View style={styles.scoreBreakdown}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreItemLabel}>Moisture</Text>
          <Text style={styles.scoreItemValue}>85%</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreItemLabel}>Nutrients</Text>
          <Text style={styles.scoreItemValue}>72%</Text>
        </View>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreItemLabel}>pH Level</Text>
          <Text style={styles.scoreItemValue}>80%</Text>
        </View>
      </View>
    </LinearGradient>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingSpinner}></View>
          <Text style={styles.loadingText}>Loading Farm Data...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A5D3E" />
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E8B57']}
            tintColor="#2E8B57"
          />
        }
      >
        
        {/* Weather Header */}
        <Animated.View 
          style={[
            styles.weatherHeader,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#1A5D3E', '#2E8B57', '#3CB371']}
            style={styles.weatherGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.weatherHeaderContent}>
              <View style={styles.weatherMain}>
                <Text style={styles.temperature}>{weatherData.temperature}</Text>
                <Text style={styles.weatherCondition}>{weatherData.condition}</Text>
                <View style={styles.locationContainer}>
                  <Text style={styles.locationText}>📍 {weatherData.location} • Wheat Field</Text>
                </View>
              </View>
              <View style={styles.cropIndicator}>
                <Text style={styles.cropIcon}>🌾</Text>
                <Text style={styles.cropText}>Active Growth</Text>
                <View style={styles.growthIndicator}>
                  <View style={styles.growthBar}></View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats Row */}
        <Animated.View 
          style={[
            styles.statsRow,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <WeatherMetric icon="💧" value={weatherData.humidity} label="Humidity" />
          <WeatherMetric icon="🌧️" value={weatherData.rainChance} label="Rain" />
          <WeatherMetric icon="💨" value={weatherData.windSpeed} label="Wind" />
          <WeatherMetric icon="🌱" value={weatherData.soilMoisture} label="Soil Moist" />
        </Animated.View>

        {/* Main Content */}
        <View style={styles.content}>
          
          {/* Today's Weather Card */}
          <Animated.View 
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Today's Overview</Text>
                <View style={styles.soilBadge}>
                  <Text style={styles.soilBadgeText}>{weatherData.soilType}</Text>
                </View>
              </View>
              
              <View style={styles.detailedMetrics}>
                <View style={styles.metricRow}>
                  <Text style={styles.metricName}>Feels Like</Text>
                  <Text style={styles.metricValue}>{weatherData.feelsLike}</Text>
                </View>
                <View style={styles.dividerLine} />
                <View style={styles.metricRow}>
                  <Text style={styles.metricName}>UV Index</Text>
                  <Text style={styles.metricValue}>{weatherData.uvIndex} ({weatherData.uvIndex > 6 ? 'High' : 'Moderate'})</Text>
                </View>
                <View style={styles.dividerLine} />
                <View style={styles.metricRow}>
                  <Text style={styles.metricName}>Visibility</Text>
                  <Text style={styles.metricValue}>{weatherData.visibility}</Text>
                </View>
                <View style={styles.dividerLine} />
                <View style={styles.metricRow}>
                  <Text style={styles.metricName}>Pressure</Text>
                  <Text style={styles.metricValue}>{weatherData.pressure}</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Soil Health Analysis - Improved Graphical Version */}
          <Animated.View 
            style={[
              styles.card,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Soil Health Analysis</Text>
              
              {/* Soil Health Score */}
              <SoilHealthScore />

              {/* Graphical Soil Metrics */}
              <View style={styles.graphicalMetrics}>
                <SoilHealthGauge 
                  title="Moisture Level" 
                  value={42} 
                  level="Optimal" 
                  color="#4ECDC4"
                  optimalRange="40-60%"
                  unit="%"
                />
                <SoilHealthGauge 
                  title="pH Balance" 
                  value={65} 
                  level="Good" 
                  color="#10B981"
                  optimalRange="6.0-7.0"
                  unit=""
                />
                <SoilHealthGauge 
                  title="Organic Matter" 
                  value={35} 
                  level="Low" 
                  color="#F59E0B"
                  optimalRange="3-5%"
                  unit="%"
                />
              </View>

              {/* Nutrient Chart */}
              <NutrientChart />

              {/* Recommendations */}
              <View style={styles.recommendationContainer}>
                <View style={styles.recommendationItem}>
                  <LinearGradient
                    colors={['#4ECDC4', '#2E8B57']}
                    style={styles.recommendationIcon}
                  >
                    <Text style={styles.iconText}>💦</Text>
                  </LinearGradient>
                  <View style={styles.recommendationText}>
                    <Text style={styles.recommendationTitle}>Irrigation Schedule</Text>
                    <Text style={styles.recommendationDesc}>Water lightly tonight between 8-10 PM</Text>
                  </View>
                </View>
                
                <View style={styles.recommendationItem}>
                  <LinearGradient
                    colors={['#4ECDC4', '#2E8B57']}
                    style={styles.recommendationIcon}
                  >
                    <Text style={styles.iconText}>🛡️</Text>
                  </LinearGradient>
                  <View style={styles.recommendationText}>
                    <Text style={styles.recommendationTitle}>Disease Risk Assessment</Text>
                    <Text style={styles.recommendationDesc}>Low probability - Optimal conditions</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.nutrientNote}>Monitor phosphorus levels for optimal growth. Next soil test in 15 days.</Text>
            </View>
          </Animated.View>

          {/* AI Advisor Alert */}
          <Animated.View 
            style={[
              styles.alertCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.alertContent}>
              <View style={styles.alertHeader}>
                <View style={styles.aiIcon}>
                  <Text style={styles.aiIconText}>🤖</Text>
                </View>
                <View style={styles.alertTitleContainer}>
                  <Text style={styles.alertTitle}>AI Advisor Alert</Text>
                  <Text style={styles.alertSubtitle}>Priority: High</Text>
                </View>
              </View>
              <Text style={styles.alertMessage}>
                ⚠️ {weatherData.rainChance > '20%' ? 'Rain expected tomorrow. Ensure proper drainage.' : 'Optimal weather conditions for the next 3 days.'}
              </Text>
              <View style={styles.alertActions}>
                <TouchableOpacity style={styles.alertButton}>
                  <Text style={styles.alertButtonText}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Text style={styles.secondaryButtonText}>Dismiss</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* Agricultural News */}
          <View style={styles.newsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Agricultural News</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.newsScroll}
              contentContainerStyle={styles.newsScrollContent}
            >
              {newsData && newsData.map((news, index) => (
                <NewsCard key={index} {...news} index={index} />
              ))}
            </ScrollView>
          </View>

          {/* Bottom Padding */}
          <View style={styles.bottomPadding} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8f4',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8f4',
    paddingHorizontal: 20,
  },
  loadingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 50,
    height: 50,
    borderWidth: 3,
    borderColor: '#2E8B57',
    borderTopColor: 'transparent',
    borderRadius: 25,
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  weatherHeader: {
    width: width - 32,
    height: 240,
    marginTop: 15,
    marginHorizontal: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
  },
  weatherGradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 25,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  weatherHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weatherMain: {
    flex: 1,
  },
  temperature: {
    fontSize: 46,
    fontWeight: '300',
    color: 'white',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  weatherCondition: {
    fontSize: 18,
    color: '#E8F5E8',
    fontWeight: '500',
    marginTop: 16,
    paddingTop: 2,
    marginBottom: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  locationContainer: {
    marginTop: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#C8E6C9',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cropIndicator: {
    alignItems: 'flex-end',
  },
  cropIcon: {
    fontSize: 34,
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cropText: {
    fontSize: 13,
    color: '#E8F5E8',
    fontWeight: '600',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  growthIndicator: {
    width: 75,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  growthBar: {
    width: '75%',
    height: '100%',
    backgroundColor: '#C8E6C9',
    borderRadius: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -25,
    marginHorizontal: 16,
    marginBottom: 25,
    gap: 10,
  },
  metricContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 5,
    height: 150,
    paddingTop: 15,
    borderRadius: 20,
    flex: 1,
    minWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e8f5e9',
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  metricIconText: {
    fontSize: 18,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  content: {
    paddingHorizontal: 16,
    gap: 18,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f8f4',
    width: '100%',
    minHeight: 200,
  },
  cardContent: {
    padding: 22,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  soilBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  soilBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  detailedMetrics: {
    gap: 14,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  metricName: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  risingTrend: {
    color: '#10B981',
    fontWeight: '700',
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 2,
  },
  // Improved Graphical Soil Health Styles
  graphicalMetrics: {
    gap: 16,
    marginBottom: 20,
  },
  gaugeCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gaugeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
  },
  gaugeWrapper: {
    marginBottom: 8,
  },
  gaugeBackground: {
    height: 24,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 6,
    backgroundColor: '#E2E8F0',
  },
  gaugeGradient: {
    width: '100%',
    height: '100%',
  },
  gaugeNeedle: {
    position: 'absolute',
    top: -4,
    width: 3,
    height: 32,
    backgroundColor: '#1E293B',
    borderRadius: 2,
    transform: [{ translateX: -1.5 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  gaugeMarker: {
    position: 'absolute',
    top: 0,
    left: '50%',
    width: 2,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.5)',
    transform: [{ translateX: -1 }],
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  gaugeLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  gaugeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gaugeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  optimalRange: {
    fontSize: 12,
    color: '#64748B',
  },
  // Nutrient Chart Styles
  nutrientChartCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
    textAlign: 'center',
  },
  chartBars: {
    gap: 16,
  },
  nutrientBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  barInfo: {
    flex: 1,
  },
  nutrientName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 2,
  },
  nutrientValue: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  barContainer: {
    flex: 2,
    height: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 6,
  },
  nutrientStatus: {
    fontSize: 12,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  highStatus: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  mediumStatus: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  optimalStatus: {
    backgroundColor: '#CCFBF1',
    color: '#0F766E',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  // Soil Health Score Styles
  healthScoreCard: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 12,
  },
  scoreCircle: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '300',
    color: 'white',
  },
  scoreLabel: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  scoreDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    textAlign: 'center',
  },
  scoreBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  scoreItem: {
    alignItems: 'center',
  },
  scoreItemLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  scoreItemValue: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  recommendationContainer: {
    gap: 18,
    marginBottom: 24,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  recommendationIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  iconText: {
    fontSize: 20,
  },
  recommendationText: {
    flex: 1,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  recommendationDesc: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  nutrientNote: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 18,
  },
  alertCard: {
    backgroundColor: '#FEF3F2',
    borderRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 5,
    borderLeftWidth: 5,
    borderLeftColor: '#DC2626',
    width: '100%',
    minHeight: 180,
  },
  alertContent: {
    padding: 22,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  aiIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#FECACA',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  aiIconText: {
    fontSize: 18,
  },
  alertTitleContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 2,
  },
  alertSubtitle: {
    fontSize: 13,
    color: '#EF4444',
    fontWeight: '500',
  },
  alertMessage: {
    fontSize: 15,
    color: '#7F1D1D',
    lineHeight: 22,
    marginBottom: 20,
  },
  alertActions: {
    flexDirection: 'row',
    gap: 10,
  },
  alertButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  alertButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DC2626',
    flex: 1,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },
  newsSection: {
    marginBottom: 10,
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  seeAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  seeAllText: {
    fontSize: 13,
    color: '#2E8B57',
    fontWeight: '700',
  },
  newsScroll: {
    paddingBottom: 10,
  },
  newsScrollContent: {
    paddingRight: 16,
  },
  newsCard: {
    borderRadius: 18,
    overflow: 'hidden',
    marginRight: 16,
    width: 280,
    height: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  newsCardGradient: {
    padding: 20,
    height: '100%',
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
    textTransform: 'uppercase',
  },
  newsTime: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 22,
    marginBottom: 10,
  },
  newsLocation: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 20,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 'auto',
  },
  readMoreBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  readMoreText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  bottomPadding: {
    height: 30,
  },
});

export default AgricultureApp;