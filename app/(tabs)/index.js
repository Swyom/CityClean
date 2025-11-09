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
  const [userLocation, setUserLocation] = useState(null);
  const [locationName, setLocationName] = useState('Getting location...');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  // API Keys
  const NEWS_API_KEY = 'e432746d2b6b49afae88335182323aca';

  useEffect(() => {
    getUserLocation();
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

  const getUserLocation = async () => {
    try {
      // Use IP-based location service as fallback
      const ipResponse = await fetch('http://ip-api.com/json/');
      const ipData = await ipResponse.json();
      
      if (ipData && ipData.lat && ipData.lon) {
        setUserLocation({ latitude: ipData.lat, longitude: ipData.lon });
        setLocationName(ipData.city || ipData.regionName || 'Your Location');
        fetchData({ latitude: ipData.lat, longitude: ipData.lon });
      } else {
        // Fallback to default location (New Delhi)
        setUserLocation({ latitude: 28.6139, longitude: 77.2090 });
        setLocationName('New Delhi');
        fetchData({ latitude: 28.6139, longitude: 77.2090 });
      }
    } catch (error) {
      console.warn('Location detection failed:', error);
      // Fallback to default location
      setUserLocation({ latitude: 28.6139, longitude: 77.2090 });
      setLocationName('New Delhi');
      fetchData({ latitude: 28.6139, longitude: 77.2090 });
    }
  };

  const fetchData = async (location = userLocation) => {
    try {
      setLoading(true);
      
      if (!location) {
        console.warn('No location available, using default');
        location = { latitude: 28.6139, longitude: 77.2090 };
        setLocationName('New Delhi');
      }

      // Fetch Weather Data using user's location
      let weatherResult;
      try {
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,pressure_msl,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`
        );
        
        if (!weatherResponse.ok) {
          throw new Error(`Weather API failed: ${weatherResponse.status}`);
        }
        
        weatherResult = await weatherResponse.json();
        console.log('Weather API Success:', weatherResult);
      } catch (weatherError) {
        console.warn('Weather API failed, using fallback:', weatherError);
        weatherResult = null;
      }

      // Fetch News Data
      let newsResult;
      try {
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q=agriculture+farming+crops&language=en&pageSize=5&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`
        );
        
        if (!newsResponse.ok) {
          throw new Error(`News API failed: ${newsResponse.status}`);
        }
        
        newsResult = await newsResponse.json();
        console.log('News API Success - Raw data:', newsResult);
        
        // Filter out future dates and ensure we have valid articles
        if (newsResult.articles) {
          const currentDate = new Date();
          newsResult.articles = newsResult.articles.filter(article => {
            if (!article.publishedAt) return false;
            const articleDate = new Date(article.publishedAt);
            return articleDate <= currentDate && article.title !== '[Removed]';
          }).slice(0, 3);
        }
        
      } catch (newsError) {
        console.warn('News API failed, using fallback:', newsError);
        newsResult = null;
      }

      // Use API data or fallback to mock data
      const finalWeatherData = weatherResult ? transformWeatherData(weatherResult, locationName) : getMockWeatherData(locationName);
      const finalNewsData = newsResult && newsResult.articles && newsResult.articles.length > 0 
        ? transformNewsData(newsResult) 
        : getMockNewsData();

      setWeatherData(finalWeatherData);
      setNewsData(finalNewsData);
      
    } catch (error) {
      console.error('Overall fetch error:', error);
      // Fallback to mock data
      setWeatherData(getMockWeatherData(locationName));
      setNewsData(getMockNewsData());
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getWeatherCondition = (weatherCode) => {
    // WMO Weather interpretation codes
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Foggy',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[weatherCode] || 'Partly cloudy';
  };

  const transformWeatherData = (weatherResult, location) => {
    const current = weatherResult.current;
    const daily = weatherResult.daily;
    
    // Calculate rain chance from precipitation probability
    const rainChance = daily.precipitation_probability_max && daily.precipitation_probability_max[0] 
      ? `${daily.precipitation_probability_max[0]}%` 
      : (current.precipitation > 0 ? '30%' : '10%');

    return {
      temperature: `${Math.round(current.temperature_2m)}°C`,
      condition: getWeatherCondition(current.weather_code),
      humidity: `${current.relative_humidity_2m}%`,
      rainChance: rainChance,
      windSpeed: `${current.wind_speed_10m} km/h`,
      soilType: 'Loamy Soil',
      soilMoisture: '42%',
      temperatureTrend: 'stable',
      pressure: `${Math.round(current.pressure_msl)} hPa`,
      location: location,
      feelsLike: `${Math.round(current.temperature_2m + (current.relative_humidity_2m > 80 ? 3 : 2))}°C`,
      uvIndex: 5,
      visibility: '10 km',
      highTemp: daily.temperature_2m_max ? `${Math.round(daily.temperature_2m_max[0])}°C` : '--°C',
      lowTemp: daily.temperature_2m_min ? `${Math.round(daily.temperature_2m_min[0])}°C` : '--°C'
    };
  };

  const transformNewsData = (newsResult) => {
    if (!newsResult.articles || newsResult.articles.length === 0) {
      return getMockNewsData();
    }
    
    console.log('Transforming news data:', newsResult.articles);
    
    return newsResult.articles.slice(0, 3).map(article => ({
      title: article.title || 'Agricultural Development Update',
      location: article.source?.name || 'Agricultural News',
      time: getTimeAgo(article.publishedAt),
      category: getCategoryFromTitle(article.title)
    }));
  };

  const getMockWeatherData = (location) => {
    return {
      temperature: '28°C',
      condition: 'Sunny',
      humidity: '65%',
      rainChance: '10%',
      windSpeed: '12 km/h',
      soilType: 'Loamy Soil',
      soilMoisture: '45%',
      temperatureTrend: 'stable',
      pressure: '1013 hPa',
      location: location || 'Your Location',
      feelsLike: '30°C',
      uvIndex: 6,
      visibility: '12 km',
      highTemp: '32°C',
      lowTemp: '25°C'
    };
  };

  const getMockNewsData = () => {
    return [
      {
        title: 'Global Wheat Production Reaches New High This Season',
        location: 'International Grain Council',
        time: '2 hours ago',
        category: 'Market News'
      },
      {
        title: 'Sustainable Farming Practices Gain Traction Worldwide',
        location: 'Agricultural Innovation Summit',
        time: '5 hours ago',
        category: 'Innovation'
      },
      {
        title: 'New Smart Irrigation Technology Saves 40% Water Usage',
        location: 'FarmTech Conference',
        time: '1 day ago',
        category: 'Technology'
      }
    ];
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      
      // If date is in future, return 'Recently'
      if (date > now) return 'Recently';
      
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
      
      if (diffInHours < 1) return 'Just now';
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      return `${Math.floor(diffInHours / 24)} days ago`;
    } catch (error) {
      return 'Recently';
    }
  };

  const getCategoryFromTitle = (title) => {
    if (!title) return 'Agriculture';
    
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('tech') || lowerTitle.includes('irrigation') || lowerTitle.includes('digital') || lowerTitle.includes('smart')) 
      return 'Technology';
    if (lowerTitle.includes('market') || lowerTitle.includes('production') || lowerTitle.includes('price') || lowerTitle.includes('tariff')) 
      return 'Market News';
    if (lowerTitle.includes('sustainable') || lowerTitle.includes('organic') || lowerTitle.includes('eco') || lowerTitle.includes('climate')) 
      return 'Sustainability';
    return 'Innovation';
  };

  const onRefresh = () => {
    setRefreshing(true);
    getUserLocation();
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

  // Professional Soil Composition Bar Chart
  const SoilCompositionBarChart = ({ data, title }) => (
    <View style={styles.soilChartContainer}>
      <Text style={styles.chartTitle}>{title}</Text>
      <View style={styles.chartGrid}>
        {[0, 20, 40, 60, 80, 100].map((value) => (
          <View key={value} style={styles.gridLine}>
            <Text style={styles.gridText}>{value}%</Text>
          </View>
        ))}
      </View>
      <View style={styles.barsContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barColumn}>
            <View style={styles.barWrapper}>
              <LinearGradient
                colors={item.colors || ['#8B4513', '#A0522D']}
                style={[styles.compositionBar, { height: `${item.value}%` }]}
                start={{ x: 0, y: 1 }}
                end={{ x: 0, y: 0 }}
              >
                <Text style={styles.barValue}>{item.value}%</Text>
              </LinearGradient>
            </View>
            <View style={styles.barLabelContainer}>
              <Text style={styles.barLabel}>{item.label}</Text>
              <Text style={styles.barSubLabel}>{item.optimal}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // Professional Solid Gauge Component
  const SolidGauge = ({ value, label, optimalRange, unit = '%', color = '#2E8B57' }) => {
    const percentage = Math.min(Math.max(value, 0), 100);
    
    return (
      <View style={styles.gaugeContainer}>
        <View style={styles.gaugeHeader}>
          <Text style={styles.gaugeLabel}>{label}</Text>
          <Text style={styles.gaugeValue}>{value}{unit}</Text>
        </View>
        <View style={styles.gaugeWrapper}>
          <View style={styles.gaugeTrack}>
            <LinearGradient
              colors={['#E2E8F0', '#F1F5F9']}
              style={styles.gaugeBackground}
            />
            <View style={[styles.gaugeFill, { width: `${percentage}%`, backgroundColor: color }]} />
            <View style={styles.gaugeOptimalRange}>
              <View style={[styles.optimalMarker, { left: `${optimalRange.min}%` }]} />
              <View style={[styles.optimalMarker, { left: `${optimalRange.max}%` }]} />
            </View>
          </View>
          <View style={styles.gaugeScale}>
            <Text style={styles.scaleText}>0{unit}</Text>
            <Text style={styles.scaleText}>50{unit}</Text>
            <Text style={styles.scaleText}>100{unit}</Text>
          </View>
        </View>
        <View style={styles.gaugeStatus}>
          <Text style={styles.optimalRangeText}>
            Optimal: {optimalRange.min}{unit} - {optimalRange.max}{unit}
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(value, optimalRange) }
          ]}>
            <Text style={styles.statusText}>
              {getStatusText(value, optimalRange)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const getStatusColor = (value, optimalRange) => {
    if (value >= optimalRange.min && value <= optimalRange.max) return '#10B981';
    if (value < optimalRange.min - 10 || value > optimalRange.max + 10) return '#EF4444';
    return '#F59E0B';
  };

  const getStatusText = (value, optimalRange) => {
    if (value >= optimalRange.min && value <= optimalRange.max) return 'Optimal';
    if (value < optimalRange.min) return 'Low';
    return 'High';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <View style={styles.loadingSpinner}></View>
          <Text style={styles.loadingText}>Getting your location...</Text>
          <Text style={styles.locationSubtext}>Fetching local weather data</Text>
        </View>
      </View>
    );
  }

  // Soil composition data
  const soilCompositionData = [
    { label: 'Sand', value: 40, optimal: '40-60%', colors: ['#F4A460', '#D2691E'] },
    { label: 'Silt', value: 30, optimal: '20-40%', colors: ['#DEB887', '#CD853F'] },
    { label: 'Clay', value: 20, optimal: '15-25%', colors: ['#8B4513', '#A0522D'] },
    { label: 'Organic', value: 10, optimal: '5-10%', colors: ['#654321', '#8B4513'] }
  ];

  // Soil health metrics
  const soilHealthMetrics = [
    { label: 'Moisture Level', value: 65, unit: '%', optimalRange: { min: 40, max: 70 }, color: '#3B82F6' },
    { label: 'pH Balance', value: 6.8, unit: '', optimalRange: { min: 6.0, max: 7.0 }, color: '#10B981' },
    { label: 'Nitrogen', value: 85, unit: 'ppm', optimalRange: { min: 50, max: 100 }, color: '#8B4513' },
    { label: 'Organic Matter', value: 4.2, unit: '%', optimalRange: { min: 3, max: 5 }, color: '#D2691E' }
  ];

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
        {/* Top Padding for Weather Section */}
        <View style={styles.topPadding} />
        
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
                <Text style={styles.temperature}>{weatherData?.temperature || '--°C'}</Text>
                <Text style={styles.weatherCondition}>{weatherData?.condition || 'Loading...'}</Text>
                <View style={styles.locationRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.locationText}>
                    {weatherData?.location || 'Getting location...'} • Wheat Field
                  </Text>
                </View>
                <View style={styles.tempRange}>
                  <Text style={styles.tempRangeText}>H: {weatherData?.highTemp || '--°C'}</Text>
                  <Text style={styles.tempRangeText}>L: {weatherData?.lowTemp || '--°C'}</Text>
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
          <WeatherMetric icon="💧" value={weatherData?.humidity || '--%'} label="Humidity" />
          <WeatherMetric icon="🌧️" value={weatherData?.rainChance || '--%'} label="Rain" />
          <WeatherMetric icon="💨" value={weatherData?.windSpeed || '-- km/h'} label="Wind" />
          <WeatherMetric icon="🌱" value={weatherData?.soilMoisture || '--%'} label="Soil Moist" />
        </Animated.View>

        {/* Main Content */}
        <View style={styles.content}>
          
          {/* Professional Soil Analysis Card */}
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
                <Text style={styles.cardTitle}>Soil Analysis</Text>
                <View style={styles.soilTypeBadge}>
                  <Text style={styles.soilTypeBadgeText}>Loamy Soil</Text>
                </View>
              </View>
              
              {/* Soil Composition Bar Chart */}
              <SoilCompositionBarChart 
                data={soilCompositionData} 
                title="Soil Composition Analysis" 
              />

              {/* Soil Health Gauges */}
              <View style={styles.gaugesSection}>
                <Text style={styles.sectionTitle}>Soil Health Metrics</Text>
                <View style={styles.gaugesGrid}>
                  {soilHealthMetrics.map((metric, index) => (
                    <SolidGauge
                      key={index}
                      value={metric.value}
                      label={metric.label}
                      unit={metric.unit}
                      optimalRange={metric.optimalRange}
                      color={metric.color}
                    />
                  ))}
                </View>
              </View>

              {/* Soil Summary */}
              <View style={styles.soilSummary}>
                <View style={styles.summaryHeader}>
                  <Text style={styles.summaryTitle}>Soil Health Summary</Text>
                  <View style={styles.healthScore}>
                    <Text style={styles.healthScoreValue}>78</Text>
                    <Text style={styles.healthScoreLabel}>/100</Text>
                  </View>
                </View>
                <Text style={styles.summaryText}>
                  Your soil shows good composition with optimal moisture levels. 
                  Consider adding organic matter to improve nutrient retention.
                </Text>
                <View style={styles.recommendation}>
                  <Text style={styles.recommendationTitle}>💡 Recommendation</Text>
                  <Text style={styles.recommendationText}>
                    Apply compost fertilizer in the next 7 days to maintain optimal nutrient levels.
                  </Text>
                </View>
              </View>
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
                  <Text style={styles.alertSubtitle}>Location-based Analysis</Text>
                </View>
              </View>
              <Text style={styles.alertMessage}>
                ⚠️ {weatherData?.rainChance > '20%' ? `Rain expected (${weatherData.rainChance}) in your area. Ensure proper drainage.` : 'Optimal weather conditions for farming in your location.'}
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
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  topPadding: {
    height: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
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
    marginBottom: 8,
  },
  locationSubtext: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '400',
  },
  weatherHeader: {
    width: width - 32,
    height: 260,
    marginTop: 10,
    marginHorizontal: 16,
    borderRadius: 25,
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
    paddingVertical: 25,
    justifyContent: 'center',
  },
  weatherHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  weatherMain: {
    flex: 1,
    paddingRight: 10,
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    color: 'white',
    letterSpacing: -1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    marginBottom: 4,
  },
  weatherCondition: {
    fontSize: 18,
    color: '#E8F5E8',
    fontWeight: '500',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 14,
    color: '#C8E6C9',
    marginRight: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  locationText: {
    fontSize: 15,
    color: '#C8E6C9',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    flex: 1,
  },
  tempRange: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 16,
  },
  tempRangeText: {
    fontSize: 14,
    color: '#C8E6C9',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cropIndicator: {
    alignItems: 'flex-end',
    paddingTop: 4,
  },
  cropIcon: {
    fontSize: 36,
    marginBottom: 8,
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
    textAlign: 'right',
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
    marginTop: -20,
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
    borderColor: '#f1f5f9',
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
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  soilTypeBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  soilTypeBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  // Soil Composition Bar Chart Styles
  soilChartContainer: {
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  gridLine: {
    alignItems: 'center',
  },
  gridText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 6,
  },
  compositionBar: {
    borderRadius: 8,
    minHeight: 24,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  barValue: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  barLabelContainer: {
    marginTop: 8,
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  barSubLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  // Solid Gauge Styles
  gaugesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
    textAlign: 'center',
  },
  gaugesGrid: {
    gap: 20,
  },
  gaugeContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  gaugeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gaugeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  gaugeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  gaugeWrapper: {
    marginBottom: 12,
  },
  gaugeTrack: {
    height: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  gaugeBackground: {
    width: '100%',
    height: '100%',
  },
  gaugeFill: {
    position: 'absolute',
    height: '100%',
    borderRadius: 10,
  },
  gaugeOptimalRange: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  optimalMarker: {
    position: 'absolute',
    width: 2,
    height: '100%',
    backgroundColor: '#1E293B',
    opacity: 0.3,
  },
  gaugeScale: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  scaleText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  gaugeStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optimalRangeText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  // Soil Summary Styles
  soilSummary: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  healthScore: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  healthScoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  healthScoreLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  summaryText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  recommendation: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  // Rest of the styles remain the same...
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
    height: 280,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  newsCardGradient: {
    padding: 10,
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