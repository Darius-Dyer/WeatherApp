import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MainSearch from '../screens/MainSearch';
import SavedLocations from 'screens/SavedLocations';

type RootStackParamList = {
  'Weather Search': undefined;
  'Saved Locations': undefined;
};

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Weather Search" component={MainSearch} />
        <Stack.Screen name="Saved Locations" component={SavedLocations} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
