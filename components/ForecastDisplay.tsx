import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';
import type { WeatherData } from 'types';

const ForecastDisplay = ({
  isMetric,
  weatherData,
}: {
  isMetric: boolean;
  weatherData: WeatherData;
}) => {
  const formattedDate = weatherData?.location?.localtime
    ? new Date(weatherData.location.localtime).toLocaleDateString()
    : '-';

  console.log(weatherData?.forecast?.forecastday.length);
  return (
    <View>
      <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 25, fontWeight: 'bold' }}>
        Forecast For 3 Days.
      </Text>
      <ScrollView
        horizontal
        contentContainerStyle={{
          marginTop: 20,
          borderColor: '#1e1e1e',
          borderWidth: 4,
          borderRadius: 8,
          padding: 10,
        }}>
        <View style={{ flexDirection: 'row' }}>
          {weatherData?.forecast?.forecastday.map((day, index: number) => {
            const formattedDate = new Date(`${day.date}T00:00:00`).toLocaleDateString();
            return (
              <View key={index} style={{ padding: 8, margin: 4 }}>
                {index === 0 ? (
                  <>
                    <Text style={{ ...styles.text, fontSize: 18 }}>Today</Text>
                    <Text style={styles.text}>Date:{formattedDate}</Text>
                  </>
                ) : index === 1 ? (
                  <>
                    <Text style={{ ...styles.text, fontSize: 18 }}>Tomorrow</Text>
                    <Text style={styles.text}>Date: {formattedDate}</Text>
                  </>
                ) : (
                  <>
                    <Text style={{ ...styles.text, fontSize: 18 }}>Day After</Text>
                    <Text style={styles.text}>Date: {formattedDate}</Text>
                  </>
                )}

                <Text style={styles.text}>
                  Max Temp: {isMetric ? `${day.day?.maxtemp_c}°C` : `${day.day?.maxtemp_f}°F`}
                </Text>
                <Text style={styles.text}>Condition: {day.day.condition.text}</Text>
                <Image
                  source={{ uri: `https:${day.day.condition.icon}` }}
                  style={{ width: 50, height: 50, alignSelf: 'center' }}
                />
                <Text style={styles.text}>Sunrise: {day.astro?.sunrise}</Text>
                <Text style={styles.text}>Sunset: {day.astro?.sunset}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
export default ForecastDisplay;
