import type { StaticScreenProps } from '@react-navigation/native';
import { ScreenContent } from 'components/ScreenContent';

import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, View, TextInput, TouchableOpacity, Image, Text } from 'react-native';
import { useState, useEffect, useCallback } from 'react';

type Props = StaticScreenProps<{
  name: string;
}>;

let displaySearch: false;
interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windspeed: number;
  city: string;
}

const Details = ({ route }: Props) => {
  const [displaySearch, setDisplaySearch] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>({
    temperature: 0,
    condition: '',
    humidity: 0,
    windspeed: 0,
    city: '',
  });
  const [location, setLocation] = useState('');
  return (
    <View className="relative flex-1">
      <SafeAreaView className="flex flex-1">
        <View>
          <Text className="text-2xl font-bold text-blue-600 dark:text-sky-400">
            Weather Details
          </Text>

          <TouchableOpacity>
            <Image />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Details;

// export default function Details({ route }: Props) {

//   return (
//     <View style={styles.container}>
//       <ScreenContent
//         path="screens/details.tsx"
//         title={`Showing details for user ${route.params?.name}`}
//       />
//     </View>
//   );
// }

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
