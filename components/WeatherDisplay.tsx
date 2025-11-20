import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { WeatherData } from '../types';

const WeatherDisplay = ({
  weatherData,
  isMetric,
  toggleUnits,
}: {
  weatherData: WeatherData;
  isMetric: boolean;
  toggleUnits: () => void;
}) => {
  return (
    <View style={{ borderColor: 'black', borderWidth: 4, borderRadius: 10, padding: 7 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          flex: 1,
        }}>
        <TouchableOpacity
          onPress={toggleUnits}
          style={{
            padding: 5,
            backgroundColor: '#1e1e1e',
            borderRadius: 5,
            alignSelf: 'center',
          }}>
          <Text style={{ color: '#fff', fontSize: 10 }}>
            {isMetric ? 'Switch to Imperial' : 'Switch to Metric'}
          </Text>
        </TouchableOpacity>

        <Image
          style={{
            width: 70,
            height: 70,
            alignSelf: 'flex-start',
            marginLeft: 20,
          }}
          source={{ uri: `https:${weatherData.current.condition.icon}` }}
        />
        <Text
          style={{
            fontSize: 15,
            fontWeight: 'bold',
            color: '#1e1e1e',
            alignSelf: 'center',
            textAlign: 'center',
          }}>
          Current Condition{'\n'}
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#1e1e1e', marginTop: 5 }}>
            {weatherData.current.condition.text}
          </Text>
        </Text>
      </View>

      <Text style={styles.text}>
        Country: {weatherData?.location?.country}
        {'\n'}
        City: {weatherData?.location?.name}
        {'\n'}
        Region: {weatherData?.location?.region}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View style={{}}>
          <Text style={styles.text}>
            Temperature:
            {isMetric ? ` ${weatherData.current.temp_c}°C` : ` ${weatherData.current.temp_f}°F`}
          </Text>
          <Text style={styles.text}>Humidity: {weatherData?.current?.humidity}</Text>
        </View>

        <View style={{}}>
          <Text style={styles.text}>
            Wind Speed:
            {isMetric
              ? ` ${weatherData.current.wind_kph}kph`
              : ` ${weatherData.current.wind_mph}mph`}
          </Text>
          <Text style={styles.text}>
            Feels Like:
            {isMetric
              ? ` ${weatherData.current.feelslike_c}°C`
              : ` ${weatherData.current.feelslike_f}°F`}
          </Text>
        </View>
      </View>

      <View className="flex flex-col">
        <Text className="m-1.5 self-center p-1.5 text-center text-base font-bold text-[#1e1e1e]">
          Current Date:{'\n'}
          {weatherData?.location?.localtime
            ? new Date(weatherData.location.localtime).toLocaleDateString()
            : '-'}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text className="m-1.5 self-center p-1.5 text-center text-base font-bold text-[#1e1e1e]">
            Current Local Time: {'\n'}
            {weatherData.location.localtime
              ? new Date(weatherData.location.localtime).toLocaleTimeString([], {
                  hour: 'numeric',
                  minute: '2-digit',
                })
              : '-'}
          </Text>
          <Text className="m-1.5 self-center p-1.5 text-center text-base font-bold text-[#1e1e1e]">
            Time Zone:{'\n'}
            {weatherData?.location?.tz_id}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    margin: 5,
    padding: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1e1e1e',
  },
});
export default WeatherDisplay;
