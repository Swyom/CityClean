import React, { useState, useEffect } from 'react';
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
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const MarketScreen = ({ navigation }) => {
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [timeRange, setTimeRange] = useState('7d');
  const [marketData, setMarketData] = useState(null);

  // Mock market data
  const cropData = {
    Tomato: {
      currentPrice: '₹45/kg',
      change: '+12%',
      isPositive: true,
      description: 'High demand in northern markets due to festival season',
      prediction: {
        nextWeek: '₹48-52/kg',
        nextMonth: '₹42-46/kg',
        trend: 'upward'
      },
      historicalData: [40, 42, 38, 45, 43, 47, 45],
      volumeData: [1200, 1400, 1100, 1600, 1500, 1700, 1650],
      regions: [
        { name: 'Delhi', price: '₹48/kg', change: '+15%' },
        { name: 'Mumbai', price: '₹42/kg', change: '+8%' },
        { name: 'Chennai', price: '₹46/kg', change: '+10%' },
        { name: 'Kolkata', price: '₹44/kg', change: '+12%' }
      ]
    },
    Wheat: {
      currentPrice: '₹22/kg',
      change: '-3%',
      isPositive: false,
      description: 'Stable supply with moderate demand from flour mills',
      prediction: {
        nextWeek: '₹21-23/kg',
        nextMonth: '₹23-25/kg',
        trend: 'stable'
      },
      historicalData: [24, 23, 22, 22, 21, 22, 22],
      volumeData: [5000, 4800, 5200, 5100, 4900, 5300, 5200],
      regions: [
        { name: 'Punjab', price: '₹21/kg', change: '-2%' },
        { name: 'Haryana', price: '₹22/kg', change: '-4%' },
        { name: 'UP', price: '₹23/kg', change: '-1%' },
        { name: 'MP', price: '₹21/kg', change: '-3%' }
      ]
    },
    Potato: {
      currentPrice: '₹18/kg',
      change: '+5%',
      isPositive: true,
      description: 'Seasonal demand increase from snack industry',
      prediction: {
        nextWeek: '₹19-21/kg',
        nextMonth: '₹16-18/kg',
        trend: 'upward'
      },
      historicalData: [16, 17, 16, 18, 17, 18, 18],
      volumeData: [3000, 3200, 3100, 3400, 3300, 3500, 3450],
      regions: [
        { name: 'UP', price: '₹17/kg', change: '+6%' },
        { name: 'West Bengal', price: '₹19/kg', change: '+4%' },
        { name: 'Bihar', price: '₹18/kg', change: '+5%' },
        { name: 'Gujarat', price: '₹20/kg', change: '+3%' }
      ]
    },
    Onion: {
      currentPrice: '₹35/kg',
      change: '+25%',
      isPositive: true,
      description: 'Supply constraints due to unseasonal rains in major growing regions',
      prediction: {
        nextWeek: '₹38-42/kg',
        nextMonth: '₹30-35/kg',
        trend: 'upward'
      },
      historicalData: [25, 28, 30, 32, 33, 34, 35],
      volumeData: [2000, 1800, 2200, 2100, 1900, 2300, 2250],
      regions: [
        { name: 'Maharashtra', price: '₹33/kg', change: '+28%' },
        { name: 'Karnataka', price: '₹36/kg', change: '+22%' },
        { name: 'MP', price: '₹34/kg', change: '+24%' },
        { name: 'Rajasthan', price: '₹37/kg', change: '+26%' }
      ]
    },
    Rice: {
      currentPrice: '₹38/kg',
      change: '+2%',
      isPositive: true,
      description: 'Steady export demand keeping prices firm',
      prediction: {
        nextWeek: '₹38-40/kg',
        nextMonth: '₹39-42/kg',
        trend: 'stable'
      },
      historicalData: [37, 37, 38, 37, 38, 38, 38],
      volumeData: [8000, 8200, 7900, 8100, 8300, 8400, 8350],
      regions: [
        { name: 'Andhra', price: '₹37/kg', change: '+1%' },
        { name: 'Telangana', price: '₹39/kg', change: '+3%' },
        { name: 'Punjab', price: '₹38/kg', change: '+2%' },
        { name: 'TN', price: '₹40/kg', change: '+2%' }
      ]
    }
  };

  const crops = Object.keys(cropData);

  useEffect(() => {
    setMarketData(cropData[selectedCrop]);
  }, [selectedCrop]);

  const chartConfig = {
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#4CAF50'
    }
  };

  const timeLabels = {
    '7d': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    '1m': ['W1', 'W2', 'W3', 'W4'],
    '3m': ['Jan', 'Feb', 'Mar']
  };

  const getChartData = () => {
    const labels = timeLabels[timeRange];
    const data = marketData?.historicalData.slice(-labels.length) || [];
    
    return {
      labels,
      datasets: [
        {
          data,
          color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };

  const getVolumeData = () => {
    const labels = timeLabels[timeRange];
    const data = marketData?.volumeData.slice(-labels.length) || [];
    
    return {
      labels,
      datasets: [
        {
          data,
        }
      ]
    };
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'upward': return 'trending-up';
      case 'downward': return 'trending-down';
      default: return 'trending-flat';
    }
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'upward': return '#4CAF50';
      case 'downward': return '#F44336';
      default: return '#FF9800';
    }
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
              <Text style={styles.headerTitle}>Market Prices</Text>
              <Text style={styles.headerSubtitle}>Live crop prices & predictions</Text>
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

          {/* Crop Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Crop</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.cropScrollView}
            >
              {crops.map((crop) => (
                <TouchableOpacity
                  key={crop}
                  onPress={() => setSelectedCrop(crop)}
                >
                  <LinearGradient
                    colors={selectedCrop === crop ? ['#2E7D32', '#4CAF50'] : ['#FFFFFF', '#F8FFF8']}
                    style={[
                      styles.cropButton,
                      selectedCrop === crop && styles.cropButtonSelected
                    ]}
                  >
                    <Text style={[
                      styles.cropButtonText,
                      selectedCrop === crop && styles.cropButtonTextSelected
                    ]}>
                      {crop}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {marketData && (
            <>
              {/* Current Price Card */}
              <View style={styles.section}>
                <LinearGradient
                  colors={['#FFFFFF', '#F8FFF8']}
                  style={styles.priceCard}
                >
                  <View style={styles.priceHeader}>
                    <View>
                      <Text style={styles.cropName}>{selectedCrop}</Text>
                      <Text style={styles.priceDescription}>{marketData.description}</Text>
                    </View>
                    <View style={styles.priceChangeContainer}>
                      <View style={[
                        styles.changeBadge,
                        { backgroundColor: marketData.isPositive ? '#E8F5E8' : '#FFEBEE' }
                      ]}>
                        <Ionicons 
                          name={marketData.isPositive ? 'trending-up' : 'trending-down'} 
                          size={16} 
                          color={marketData.isPositive ? '#4CAF50' : '#F44336'} 
                        />
                        <Text style={[
                          styles.changeText,
                          { color: marketData.isPositive ? '#4CAF50' : '#F44336' }
                        ]}>
                          {marketData.change}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.priceMain}>
                    <Text style={styles.currentPrice}>{marketData.currentPrice}</Text>
                    <Text style={styles.priceLabel}>Current Market Price</Text>
                  </View>

                  <View style={styles.pricePrediction}>
                    <View style={styles.predictionItem}>
                      <Ionicons 
                        name={getTrendIcon(marketData.prediction.trend)} 
                        size={20} 
                        color={getTrendColor(marketData.prediction.trend)} 
                      />
                      <View style={styles.predictionText}>
                        <Text style={styles.predictionLabel}>Next Week</Text>
                        <Text style={styles.predictionValue}>{marketData.prediction.nextWeek}</Text>
                      </View>
                    </View>
                    <View style={styles.predictionDivider} />
                    <View style={styles.predictionItem}>
                      <Ionicons name="calendar" size={20} color="#FF9800" />
                      <View style={styles.predictionText}>
                        <Text style={styles.predictionLabel}>Next Month</Text>
                        <Text style={styles.predictionValue}>{marketData.prediction.nextMonth}</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* Price Chart */}
              <View style={styles.section}>
                <View style={styles.chartHeader}>
                  <Text style={styles.sectionTitle}>Price Trend</Text>
                  <View style={styles.timeRangeSelector}>
                    {['7d', '1m', '3m'].map((range) => (
                      <TouchableOpacity
                        key={range}
                        onPress={() => setTimeRange(range)}
                      >
                        <Text style={[
                          styles.timeRangeText,
                          timeRange === range && styles.timeRangeTextSelected
                        ]}>
                          {range}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                
                <LinearGradient
                  colors={['#FFFFFF', '#F8FFF8']}
                  style={styles.chartCard}
                >
                  <LineChart
                    data={getChartData()}
                    width={width - 64}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                    withVerticalLines={false}
                    withHorizontalLines={false}
                    withDots={true}
                    withShadow={false}
                  />
                </LinearGradient>
              </View>

              {/* Volume Chart */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Trading Volume</Text>
                <LinearGradient
                  colors={['#FFFFFF', '#F8FFF8']}
                  style={styles.chartCard}
                >
                  <BarChart
                    data={getVolumeData()}
                    width={width - 64}
                    height={180}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
                    }}
                    style={styles.chart}
                    showBarTops={false}
                    withHorizontalLabels={true}
                    withVerticalLabels={true}
                  />
                </LinearGradient>
              </View>

              {/* Regional Prices */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Regional Prices</Text>
                <View style={styles.regionsGrid}>
                  {marketData.regions.map((region, index) => (
                    <LinearGradient
                      key={region.name}
                      colors={['#FFFFFF', '#F8FFF8']}
                      style={styles.regionCard}
                    >
                      <Text style={styles.regionName}>{region.name}</Text>
                      <Text style={styles.regionPrice}>{region.price}</Text>
                      <View style={[
                        styles.regionChange,
                        { backgroundColor: region.change.includes('+') ? '#E8F5E8' : '#FFEBEE' }
                      ]}>
                        <Text style={[
                          styles.regionChangeText,
                          { color: region.change.includes('+') ? '#4CAF50' : '#F44336' }
                        ]}>
                          {region.change}
                        </Text>
                      </View>
                    </LinearGradient>
                  ))}
                </View>
              </View>

              {/* Market Insights */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Market Insights</Text>
                <LinearGradient
                  colors={['#E3F2FD', '#BBDEFB']}
                  style={styles.insightsCard}
                >
                  <View style={styles.insightItem}>
                    <Ionicons name="bulb" size={20} color="#1565C0" />
                    <Text style={styles.insightText}>
                      Best time to sell: Next 2 weeks
                    </Text>
                  </View>
                  <View style={styles.insightItem}>
                    <Ionicons name="warning" size={20} color="#E65100" />
                    <Text style={styles.insightText}>
                      Monitor weather forecasts for price fluctuations
                    </Text>
                  </View>
                  <View style={styles.insightItem}>
                    <Ionicons name="trending-up" size={20} color="#4CAF50" />
                    <Text style={styles.insightText}>
                      High demand expected in metro markets
                    </Text>
                  </View>
                </LinearGradient>
              </View>

              {/* Action Buttons */}
              <View style={styles.section}>
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.secondaryButton}>
                    <LinearGradient
                      colors={['#6D4C41', '#8D6E63']}
                      style={styles.buttonGradient}
                    >
                      <Ionicons name="notifications" size={20} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Price Alerts</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.primaryButton}>
                    <LinearGradient
                      colors={['#2E7D32', '#4CAF50']}
                      style={styles.buttonGradient}
                    >
                      <Ionicons name="share-social" size={20} color="#FFFFFF" />
                      <Text style={styles.buttonText}>Share Report</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
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
  // Crop Selection Styles
  cropScrollView: {
    flexDirection: 'row',
  },
  cropButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cropButtonSelected: {
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cropButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  cropButtonTextSelected: {
    color: '#FFFFFF',
  },
  // Price Card Styles
  priceCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  cropName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  priceDescription: {
    fontSize: 14,
    color: '#6C757D',
    lineHeight: 18,
    maxWidth: '70%',
  },
  priceChangeContainer: {
    alignItems: 'flex-end',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceMain: {
    alignItems: 'center',
    marginBottom: 20,
  },
  currentPrice: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
  },
  pricePrediction: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
  },
  predictionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  predictionText: {
    flex: 1,
  },
  predictionLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 2,
  },
  predictionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  predictionDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  // Chart Styles
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeRangeSelector: {
    flexDirection: 'row',
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
    padding: 4,
  },
  timeRangeText: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#6C757D',
  },
  timeRangeTextSelected: {
    backgroundColor: '#4CAF50',
    color: '#FFFFFF',
    borderRadius: 16,
  },
  chartCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    alignItems: 'center',
  },
  chart: {
    borderRadius: 16,
  },
  // Regions Grid
  regionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  regionCard: {
    width: (width - 48) / 2 - 8,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  regionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  regionPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 8,
  },
  regionChange: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  regionChangeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  // Insights Styles
  insightsCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#1565C0',
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
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
});

export default MarketScreen;