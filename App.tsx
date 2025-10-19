import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './global.css';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { useMemo } from 'react';
import Navigation from './navigation';
import 'react-native-reanimated';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => (colorScheme === 'dark' ? DarkTheme : DefaultTheme), [colorScheme]);

  return (
    <GestureHandlerRootView>
      <Navigation />
    </GestureHandlerRootView>
  );
}
