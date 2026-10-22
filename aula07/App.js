import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UsersScreen from './src/screens/UsersScreen.js';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <UsersScreen />
    </SafeAreaProvider>
  );
}
