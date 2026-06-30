import React from 'react';
import { useMotoStore } from '../store/motoStore';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';
import SpotBookingScreen from '../screens/SpotBookingScreen';

export default function AppNavigator() {
  const phase = useMotoStore(s => s.phase);
  const setPhase = useMotoStore(s => s.setPhase);
  const completeLogin = useMotoStore(s => s.completeLogin);
  if (phase === 'login') return <LoginScreen onLogin={completeLogin} />;
  if (phase === 'about') return <AboutScreen />;
  if (phase === 'booking') return <SpotBookingScreen navigation={{ goBack: () => setPhase('map') }} />;
  return <HomeScreen />;
}
