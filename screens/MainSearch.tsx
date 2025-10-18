import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import debounce from 'debounce';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';

import { Button } from '../components/Button';
import { useState, useCallback, useEffect, useMemo } from 'react';

interface WeatherData {
  location: Location;
  current: Current;
  forecast: Forecast;
}
interface Location {
  name: string;
  region: string;
  country: string;
  tx_id: string;
  localtime_epoch: number;
  localtime: string;
  tz_id: string;
}
interface Current {
  temp_c: number;
  temp_f: number;
  wind_mph: number;
  humidity: number;
  wind_kph: number;
  feelslike_c: number;
  feelslike_f: number;
  uv: number;
  is_day: number;
  condition: Condition;
}
interface Forecast {
  forecastday: forecastday[];
}
interface forecastday {
  date: string;
  day: day;
  astro: astro;
}
interface day {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  condition: Condition;
}

interface astro {
  sunrise: string;
  sunset: string;
}

interface Condition {
  text: string;
  icon: string;
  code: number;
}

interface SearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  url: string;
}

let controller: AbortController;
let searchText: string;

const MOCK_DATA: WeatherData = {
  location: {
    name: 'Tokyo',
    region: 'Tokyo',
    country: 'Japan',
    tx_id: 'mock123',
    localtime_epoch: 1760798618,
    localtime: '2025-10-19 04:34',
    tz_id: 'Asia/Tokyo',
  },
  current: {
    temp_c: 24.4,
    temp_f: 75.9,
    wind_mph: 4.3,
    wind_kph: 6.8,
    humidity: 78,
    feelslike_c: 25.7,
    feelslike_f: 78.3,
    uv: 0,
    is_day: 0,
    condition: {
      text: 'Partly cloudy',
      icon: '//cdn.weatherapi.com/weather/64x64/night/116.png',
      code: 1003,
    },
  },
  forecast: {
    forecastday: [
      {
        date: '2025-10-18',
        day: {
          maxtemp_c: 26,
          maxtemp_f: 79,
          mintemp_c: 17,
          mintemp_f: 63,
          condition: { text: 'Clear', icon: '', code: 1000 },
        },
        astro: {
          sunrise: '05:56 AM',
          sunset: '05:04 PM',
        },
      },
      {
        date: '2025-10-19',
        day: {
          maxtemp_c: 27,
          maxtemp_f: 81,
          mintemp_c: 18,
          mintemp_f: 64,
          condition: { text: 'Sunny', icon: '', code: 1000 },
        },
        astro: {
          sunrise: '05:57 AM',
          sunset: '05:03 PM',
        },
      },
      {
        date: '2025-10-20',
        day: {
          maxtemp_c: 25,
          maxtemp_f: 77,
          mintemp_c: 17,
          mintemp_f: 63,
          condition: { text: 'Cloudy', icon: '', code: 1006 },
        },
        astro: {
          sunrise: '05:58 AM',
          sunset: '05:02 PM',
        },
      },
    ],
  },
};

export default function Overview() {
  //Constants used for weather data

  const [gradientColors, setGradientColors] = useState<readonly [string, string]>(['#000', '#333']);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(MOCK_DATA);
  const [displaySearch, setDisplaySearch] = useState<SearchResult[] | null>(null);
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState('');
  const [isMetric, setIsMetric] = useState(true);

  const toggleUnits = () => setIsMetric((prev) => !prev);

  //Url And Key for Weather API
  const apiSearchURL = process.env.EXPO_PUBLIC_API_URL_SEARCH;
  const apiForecastURL = process.env.EXPO_PUBLIC_API_URL_FORECAST;
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  //const navigation = useNavigation();

  //Search Function for Location
  const fetchLocation = async (loc: string) => {
    if (loc.length < 3) return;

    controller?.abort();
    controller = new AbortController();

    try {
      const response = await fetch(`${apiSearchURL}key=${apiKey}&q=${loc}`, {
        signal: controller.signal,
      });
      const data = await response.json();
      setDisplaySearch(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedFetchLocation = useCallback(debounce(fetchLocation, 500), []);

  useEffect(() => {
    debouncedFetchLocation(searchText);
  }, [searchText]);

  useEffect(() => {
    return () => {
      debouncedFetchLocation.clear?.();
    };
  }, []);

  //Fetch Weather Data Function
  const fetchWeather = async (loc: string) => {
    try {
      const response = await fetch(
        `${apiForecastURL}key=${apiKey}&q=${loc}&days=3&aqi=no&alerts=no`
      );
      const data = await response.json();
      setWeatherData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fadeProgress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      fadeProgress.value,
      [0, 1],
      [gradientColors[0], gradientColors[0]]
    );
    const color2 = interpolateColor(
      fadeProgress.value,
      [0, 1],
      [gradientColors[1], gradientColors[1]]
    );
    return {};
  });

  const getGradientFromTime = (localTime?: string) => {
    if (!localTime) return ['#4B4F55', '#2F3237'] as const;
    const hour = Number(localTime.split(' ')[1].split(':')[0]);
    if (hour >= 5 && hour <= 8) {
      return ['#FAD6A5', '#FFB347'] as const; // sunrise
    } else if (hour > 8 && hour < 17) {
      return ['#A1C4FD', '#C2E9FB'] as const; // day
    } else if (hour >= 17 && hour < 20) {
      return ['#FDB99B', '#CF8BF3'] as const; // sunset
    } else {
      return ['#283E51', '#485563'] as const; // night
    }
  };

  // useEffect(() => {
  //   if (!weatherData?.location?.localtime_epoch) return;

  //   const tz = weatherData.location.tz_id;
  //   const today = weatherData.forecast.forecastday[0];
  //   const tomorrow = weatherData.forecast.forecastday[1];

  //   //Parse Time function responsible for converting 12 hour time to 24 hour time and then time zone conversion.
  //   const parseTime = (timeStr: string, dateStr: string) => {
  //     const [time, modifier] = timeStr.split(' ');
  //     let [hours, minutes] = time.split(':').map(Number);
  //     if (modifier === 'PM' && hours !== 12) hours += 12;
  //     if (modifier === 'AM' && hours === 12) hours = 0;

  //     const dateTimeLocal = new Date(
  //       `${dateStr}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
  //     );
  //     console.log('Local Time Parsed:', dateTimeLocal);
  //     return toZonedTime(dateTimeLocal, tz);
  //   };

  //   const sunriseToday = parseTime(today.astro.sunrise, today.date);
  //   const sunsetToday = parseTime(today.astro.sunset, today.date);
  //   const sunriseTommorow = parseTime(tomorrow.astro.sunrise, tomorrow.date);

  //   const localTime = toZonedTime(new Date(), tz);
  //   const oneHour = 60 * 60 * 1000;

  //   let newColors: [string, string];

  //   const sunriseStart = new Date(sunriseToday.getTime() - oneHour);
  //   const sunriseEnd = new Date(sunriseToday.getTime() + oneHour);
  //   const sunsetStart = new Date(sunsetToday.getTime() - oneHour);
  //   const sunsetEnd = new Date(sunsetToday.getTime() + oneHour);

  //   if (localTime >= sunriseStart && localTime < sunriseEnd) {
  //     newColors = ['#FFDEAD', '#FDB813']; // sunrise
  //   } else if (localTime >= sunriseEnd && localTime < sunsetStart) {
  //     newColors = ['#87CEEB', '#4FC3F7']; // day
  //   } else if (localTime >= sunsetStart && localTime < sunsetEnd) {
  //     newColors = ['#FF8C00', '#C850C0']; // sunset
  //   } else {
  //     // between sunsetEnd and next-day sunriseStart
  //     newColors = ['#0F2027', '#2C5364']; // night
  //   }

  //   fadeProgress.value = 0;
  //   setGradientColors(newColors);
  //   fadeProgress.value = withTiming(1, { duration: 700 });
  // }, [weatherData]);

  // const date = new Date(weatherData.location.localtime_epoch * 1000);
  // const hour = date.getHours();
  // console.log('Hour:', hour);
  // if (hour >= 5 && hour < 8) {
  //   setGradientColors(['#FFDEAD', '#FDB813']); // sunrise
  // } else if (hour >= 8 && hour < 17) {
  //   setGradientColors(['#87CEEB', '#4FC3F7']); // day
  // } else if (hour >= 17 && hour < 20) {
  //   setGradientColors(['#FF8C00', '#C850C0']); // sunset
  // } else {
  //   setGradientColors(['#0F2027', '#2C5364']); // night
  // }

  return (
    //User Should be able to search for a location and save it to a list of locations.
    //Here we will just search for the location and do display basic weather information.

    <LinearGradient
      colors={getGradientFromTime(weatherData?.location?.localtime)}
      style={{ flex: 1, padding: 24 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      {/*Search Button Placement Here
       Just Basic Text Input for Location and Button for Search*/}
      <View>
        <TextInput
          placeholder={'Enter Location'}
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 3,
            borderRadius: 8,
            textAlign: 'center',
          }}
          placeholderTextColor={'#1e1e1e'}
          onChangeText={(text) => {
            setSearchText(text);
          }}
          value={searchText}
        />

        {/** Once Pressed, This Opacity will Display a list of Locations similar to the one inputted by the user */}
      </View>

      {/*This View Will Display The Locations that match the search criteria. 
         If DisplaySearch exists the locations will be mapped and displayed*/}
      <View className="flex justify-center">
        {displaySearch &&
          searchText.length >= 3 &&
          displaySearch.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                setLocation(item.name);
                setDisplaySearch(null);
                fetchWeather(item.url);
              }}
              style={{ padding: 5, backgroundColor: '#1e1e1e', borderRadius: 8, margin: 10 }}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                {item.name}, {item.region}, {item.country}
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      <View>
        {/** This Displays the selected Locations Current Weather Data
         * Including loation info, temperature, humidity, and wind speed
         */}
        {weatherData ? (
          <>
            <View style={{ borderColor: 'black', borderWidth: 10 }}>
              <TouchableOpacity
                onPress={toggleUnits}
                style={{
                  padding: 10,
                  backgroundColor: '#1e1e1e',
                  borderRadius: 8,
                  alignSelf: 'flex-end',
                }}>
                <Text style={{ color: '#fff' }}>
                  {isMetric ? 'Switch to Imperial' : 'Switch to Metric'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.text}>
                Country: {weatherData?.location?.country}
                {'\n'}
                City: {weatherData?.location?.name}
                {'\n'}
                State/Province: {weatherData?.location?.region}
              </Text>

              <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text style={styles.text}>
                    Temperature:
                    {isMetric
                      ? ` ${weatherData.current.temp_c}°C`
                      : ` ${weatherData.current.temp_f}°F`}
                  </Text>
                  <Text style={styles.text}>Humidity: {weatherData?.current?.humidity}</Text>
                </View>

                <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
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
            </View>

            {/** This Displays the selected Locations 3 Day Forecast
             * Each  Day will display the date, max temp in F and C, and sunrise and sunset times.
             */}

            <ScrollView
              horizontal
              contentContainerStyle={{
                marginTop: 20,
                borderColor: '#1e1e1e',
                borderWidth: 4,
                borderRadius: 8,
                padding: 10,
              }}>
              <Text style={{ textAlign: 'center' }}>Forecast for the next 3 days:</Text>
              {weatherData?.forecast?.forecastday.map((day, index) => {
                return (
                  <View key={index} style={{ marginVertical: 10 }}>
                    <Text style={styles.text}>Date: {day.date}</Text>
                    <Text style={styles.text}>Max Temp (F): {day.day?.maxtemp_f}</Text>
                    <Text style={styles.text}>Max Temp (C): {day.day?.maxtemp_c}</Text>
                    <Text style={styles.text}>Sunrise: {day.astro?.sunrise}</Text>

                    <Text style={styles.text}>Sunset: {day.astro?.sunset}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </>
        ) : null}
      </View>

      {/* <ScreenContent path="screens/overview.tsx" title="Overview"></ScreenContent>
      <Button
        onPress={() =>
          navigation.navigate('Details', {
            name: 'Dan',
          })
        }
        title="Show Details"
      /> */}
    </LinearGradient>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  text: {
    textAlign: 'center',
    margin: 5,
    padding: 5,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1e1e1e',
  },
});
