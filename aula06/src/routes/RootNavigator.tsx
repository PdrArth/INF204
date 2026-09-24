import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AppTabs from './AppTabs';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import { colors } from '../theme';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Principal"
        screenOptions={{
          headerTintColor: colors.primaryDark,
          headerTitleStyle: { fontWeight: '800' },
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.surface },
        }}
      >
        <Stack.Screen name="Principal" component={AppTabs} options={{ headerShown: false }} />
        <Stack.Screen name="DetalhesProduto" component={ProductDetailsScreen} options={{ title: 'Detalhes' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
