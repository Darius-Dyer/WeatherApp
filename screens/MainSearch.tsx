import { useNavigation } from '@react-navigation/native';
import { ScreenContent } from 'components/ScreenContent';
import debounce from 'debounce';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

import { Button } from '../components/Button';
import { useState, useCallback, useEffect } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { SearchBar } from 'react-native-screens';

interface WeatherData {
  location: Location;
  current: Current;
}
interface Location {
  name: string;
  region: string;
  country: string;
  tx_id: string;
  localtime: string;
}
interface Current {
  temp_c: number;
  temp_f: number;
  wind_mph: number;
  humidity: number;
  wind_kph: number;
  condition: Condition;
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

export default function Overview() {
  //Constants used for weather data
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [displaySearch, setDisplaySearch] = useState<SearchResult[] | null>(null);
  const [location, setLocation] = useState('');

  //Url And Key for Weather API
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const apiKey = process.env.EXPO_PUBLIC_API_KEY;

  //const navigation = useNavigation();

  //Search Function for Location
  const fetchLocation = async (loc: string) => {
    if (loc.length < 3) return;
    try {
      const response = await fetch(`${apiUrl}/search.json?key=${apiKey}&q=${loc}`);
      const data = await response.json();
      setDisplaySearch(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  //Fetch Weather Data Function
  const fetchWeather = async (loc: string) => {
    try {
      const response = await fetch(`${apiUrl}/current.json?key=${apiKey}&q=${loc}&aqi=no`);
      const data = await response.json();
      setWeatherData(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    //User Should be able to search for a location and save it to a list of locations.
    //Here we will just search for the location and do display basic weather information.

    <View style={styles.container}>
      {/*Search Button Placement Here
       Just Basic Text Input for Location and Button for Search*/}
      <View>
        <TextInput
          placeholder="Location"
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 3,
            borderRadius: 8,
            textAlign: 'center',
          }}
          placeholderTextColor={'#1e1e1e'}
          onChangeText={(text) => {
            setLocation(text);
          }}
          value={location}
        />

        {/** Once Pressed, This Opacity will Display a list of Locations similar to the one inputted by the user */}
        <TouchableOpacity
          onPress={() => {
            fetchLocation(location);
          }}
          style={{ padding: 10, backgroundColor: '#1e1e1e', borderRadius: 8, margin: 5 }}>
          <Text style={{ color: '#fff', textAlign: 'center' }}>Search for Location</Text>
        </TouchableOpacity>
      </View>

      {/*This View Will Display The Locations that match the search criteria. 
         If DisplaySearch exists the locations will be mapped and displayed*/}
      <View className="flex justify-center">
        {displaySearch
          ? displaySearch.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setLocation(item.name);
                  setDisplaySearch(null);
                  fetchLocation(item.name);
                  fetchWeather(item.url);
                }}
                style={{ padding: 5, backgroundColor: '#1e1e1e', borderRadius: 8, margin: 10 }}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                  {item.name}, {item.region}, {item.country}
                </Text>
              </TouchableOpacity>
            ))
          : null}

        {/** This Displays the selected Locations Weather Data */}
        {weatherData ? (
          <View>
            <Text style={styles.text}>
              Location {'\n'} Country: {weatherData?.location?.country}
              {'\n'}City: {weatherData?.location?.name} {'\n'}State/Province:{' '}
              {weatherData?.location?.region}
            </Text>
            <Text style={styles.text}>Temperature: {weatherData?.current?.temp_f}</Text>
            <Text style={styles.text}>Humidity: {weatherData?.current?.humidity}</Text>
            <Text style={styles.text}>Wind Speed MPH: {weatherData?.current.wind_mph}</Text>
            <Text style={styles.text}>Wind Speed KPH: {weatherData?.current.wind_kph}</Text>
          </View>
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
    </View>
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
