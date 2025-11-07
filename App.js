import React from 'react';
import { StatusBar } from 'react-native';
import CropDetectionScreen from './app/CropDetection';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <CropDetectionScreen />
    </>
  );
}