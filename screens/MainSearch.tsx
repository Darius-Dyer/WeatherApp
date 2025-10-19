import AsyncStorage from '@react-native-async-storage/async-storage';
import debounce from 'debounce';
import { LinearGradient } from 'expo-linear-gradient';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useState, useCallback, useEffect } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

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

interface SavedLocation {
  name: string;
  country: string;
  region: string;
}

let controller: AbortController;

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

export default function MainSearch() {
  //Constants used for weather data
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [displaySearch, setDisplaySearch] = useState<SearchResult[] | null>(null);
  const [searchText, setSearchText] = useState('');
  const [location, setLocation] = useState('');
  const [isMetric, setIsMetric] = useState(true);

  //Used to toggle measurement preference, and save it in Async Storage.
  const toggleUnits = async () => {
    setIsMetric((prev) => {
      const newValue = !prev;
      AsyncStorage.setItem('UNIT_PREF', JSON.stringify(newValue));
      return newValue;
    });
  };

  const navigation = useNavigation();

  //Url And Key for Weather API
  const apiSearchURL = process.env.EXPO_PUBLIC_API_URL_SEARCH;
  const apiForecastURL = process.env.EXPO_PUBLIC_API_URL_FORECAST;
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

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

  //Debounce Location to avoid over calling the API
  const debouncedFetchLocation = useCallback(debounce(fetchLocation, 500), []);

  useEffect(() => {
    const loadSaved = async () => {
      try {
        const stored = await AsyncStorage.getItem('SAVED_LOCATIONS');
        if (stored) {
          setSavedLocations(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Failed to load saved locations', err);
      }
    };
    loadSaved();
  }, []);

  const currentName = weatherData?.location?.name;
  const isSaved = !!currentName && savedLocations.some((loc) => loc.name === currentName);

  //Function used to save locations
  const saveLocation = () => {
    if (!weatherData?.location?.name) return;

    const currentLocationObj: SavedLocation = {
      name: weatherData.location.name,
      country: weatherData.location.country,
      region: weatherData.location.region,
    };

    const alreadySaved = savedLocations.some((loc) => loc.name === currentLocationObj.name);
    if (alreadySaved) return;

    const updated = [currentLocationObj, ...savedLocations];

    setSavedLocations(updated);

    AsyncStorage.setItem('SAVED_LOCATIONS', JSON.stringify(updated));
  };

  //Runs every time SearchText changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    debouncedFetchLocation(searchText);
  }, [searchText]);

  //This only run once and runs the clear method on unmount.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return () => {
      debouncedFetchLocation.clear?.();
    };
  }, []);

  //On First mount, load and apply saved unit preference fromm AsyncStorage.
  useEffect(() => {
    const loadUnitPre = async () => {
      const stored = await AsyncStorage.getItem('UNIT_PREF');
      if (stored !== null) {
        setIsMetric(JSON.parse(stored));
      }
    };
    loadUnitPre();
  }, []);

  //Fetch Weather Data Function
  const fetchWeather = async (loc: string) => {
    try {
      const response = await fetch(
        `${apiForecastURL}key=${apiKey}&q=${loc}&days=3&aqi=no&alerts=no`
      );
      const data = await response.json();
      setWeatherData(data);

      AsyncStorage.setItem('LAST_LOCATION', loc);

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  //Get Gradient background color based on time of day
  const getGradientFromTime = (localTime?: string) => {
    if (!localTime) return ['#4B4F55', '#2F3237'] as const;
    let hour = Number(localTime.split(' ')[1].split(':')[0]);
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

  //On First mount, load and apply last searched location from AsyncStorage.
  useEffect(() => {
    const loadLastLocation = async () => {
      const saved = await AsyncStorage.getItem('LAST_LOCATION');

      //if saved exists pass it into fetchWeather Function
      if (saved) {
        fetchWeather(saved); // auto-fetch last location
      }
    };
    loadLastLocation();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        const stored = await AsyncStorage.getItem('SAVED_LOCATIONS');
        if (stored && active) setSavedLocations(JSON.parse(stored));
      };
      load();
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    //User Should be able to search for a location and save it to a list of locations.
    //Here we will just search for the location and do display basic weather information.
    <LinearGradient
      colors={getGradientFromTime(weatherData?.location?.localtime)}
      style={{ flex: 1, paddingHorizontal: 10 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Search Button Placement Here
            Just Basic Text Input for Location and Button for Search
       */}
        {weatherData &&
          (isSaved ? (
            <FontAwesome.Button
              name="star"
              size={22}
              color="gold"
              backgroundColor="#1e1e1e"
              style={{ alignItems: 'center' }}>
              Saved
            </FontAwesome.Button>
          ) : (
            <FontAwesome.Button
              name="star-o"
              size={22}
              color="white"
              backgroundColor="#1e1e1e"
              onPress={saveLocation}
              style={{ alignItems: 'center' }}>
              Save to Favorites
            </FontAwesome.Button>
          ))}
        <View style={{ marginBottom: 5, padding: 7 }}>
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
          {weatherData ? (
            <>
              {/** This Displays the selected Locations Current Weather Data
               * Including location info, temperature, humidity, and wind speed
               */}
              <View style={{ borderColor: 'black', borderWidth: 4, borderRadius: 10, padding: 7 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    onPress={toggleUnits}
                    style={{
                      padding: 10,
                      backgroundColor: '#1e1e1e',
                      borderRadius: 5,
                    }}>
                    <Text style={{ color: '#fff', fontSize: 10 }}>
                      {isMetric ? 'Switch to Imperial' : 'Switch to Metric'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('Saved Locations' as never)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: '#1e1e1e',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 5,
                    }}>
                    <FontAwesome name="list" size={12} color="white" />
                    <Text style={{ color: '#fff', fontSize: 12 }}>View Saved</Text>
                  </TouchableOpacity>

                  <Image
                    style={{ width: 50, height: 50 }}
                    source={{ uri: `https:${weatherData.current.condition.icon}` }}
                  />
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
                      {isMetric
                        ? ` ${weatherData.current.temp_c}°C`
                        : ` ${weatherData.current.temp_f}°F`}
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
                  <Text className="m-1.5 self-center p-1.5 text-center text-base font-bold text-[#1e1e1e]">
                    Current Local Time: {'\n'}
                    {weatherData.location.localtime
                      ? new Date(weatherData.location.localtime).toLocaleTimeString([], {
                          hour: 'numeric',
                          minute: '2-digit',
                        })
                      : '-'}
                  </Text>
                </View>
              </View>

              {/** This Displays the selected Locations 3 Day Forecast
               * Each  Day will display the date, max temp in F and C, and sunrise and sunset times.
               */}

              <Text style={{ textAlign: 'center', marginTop: 10 }}>Forecast For Next 3 Days.</Text>
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
                  {weatherData?.forecast?.forecastday
                    .filter((day) => {
                      const todayISO = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
                      return day.date >= todayISO;
                    })
                    .map((day, index) => {
                      return (
                        <View key={index} style={{ padding: 8, margin: 4 }}>
                          <Text style={styles.text}>Date: {day.date}</Text>
                          <Text style={styles.text}>
                            Max Temp:
                            {isMetric ? `${day.day?.maxtemp_c}°C` : `${day.day?.maxtemp_f}°F`}
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
                  {/* {weatherData?.forecast?.forecastday.map((day, index) => {
                    return (
                      <View key={index} style={{ padding: 8, margin: 4 }}>
                        <Text style={styles.text}>
                          Date: {day.day ? new Date(day.date).toLocaleDateString() : '-'}
                        </Text>
                        <Text style={styles.text}>
                          Max Temp:{' '}
                          {isMetric ? `${day.day?.maxtemp_c}°C` : `${day.day?.maxtemp_f}°F`}
                        </Text>
                        <Text style={styles.text}>Condition: {day.day.condition.text}</Text>
                        <Image
                          source={{ uri: `https:${day.day.condition.icon}` }}
                          style={{
                            width: 50,
                            height: 50,
                            alignSelf: 'center',
                          }}
                        />

                        <Text style={styles.text}>Sunrise: {day.astro?.sunrise}</Text>

                        <Text style={styles.text}>Sunset: {day.astro?.sunset}</Text>
                      </View>
                    );
                  })} */}
                </View>
              </ScrollView>
            </>
          ) : null}
        </View>
      </ScrollView>
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
