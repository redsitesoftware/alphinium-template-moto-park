import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import App from './App';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `html,body{height:auto!important;overflow-y:scroll!important}#root{height:auto!important;min-height:100vh!important}`;
  document.head.appendChild(style);
}

registerRootComponent(App);
