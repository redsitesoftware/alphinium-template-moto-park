import React from 'react';
import { useMotoStore } from '../store/motoStore';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import SpotBookingScreen from '../screens/SpotBookingScreen';

export default function AppNavigator() {
  const phase = useMotoStore(s => s.phase);
  const setPhase = useMotoStore(s => s.setPhase);
  if (phase === 'about') return <AboutScreen />;
  if (phase === 'booking') return <SpotBookingScreen navigation={{ goBack: () => setPhase('map') }} />;
  return <HomeScreen />;
}
