import React from 'react';
import { useMotoStore } from '../store/motoStore';
import HomeScreen from '../screens/HomeScreen';
import AboutScreen from '../screens/AboutScreen';

export default function AppNavigator() {
  const phase = useMotoStore(s => s.phase);
  return phase === 'about' ? <AboutScreen /> : <HomeScreen />;
}
