import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 60,
          borderTopWidth: 0.3,
          borderTopColor: '#DDD',
          elevation: 10,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case 'index': // ✅ Home screen (index.js)
              iconName = 'home-outline';
              break;
            case 'CropDetection':
              iconName = 'camera-outline';
              break;
            case 'Market':
              iconName = 'bar-chart-outline';
              break;
            case 'Profile':
              iconName = 'person-outline';
              break;
            default:
              iconName = 'apps-outline';
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      {/* Home tab */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />

      {/* Crop Detection tab */}
      <Tabs.Screen
        name="CropDetection"
        options={{
          title: 'Crop Detection',
        }}
      />

      {/* Market tab */}
      <Tabs.Screen
        name="Market"
        options={{
          title: 'Market',
        }}
      />

      {/* Profile tab */}
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
