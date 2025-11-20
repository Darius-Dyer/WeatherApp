import { StyleSheet, View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SavedLocation = {
  name: string;
  country: string;
  region: string;
};

const SavedLocations = ({ navigation }) => {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  useEffect(() => {
    const loaded = async () => {
      const stored = await AsyncStorage.getItem('SAVED_LOCATIONS');
      if (stored) setSavedLocations(JSON.parse(stored));
    };
    loaded();
  }, []);

  const removeLocation = async (name: string) => {
    const updated = savedLocations.filter((loc) => loc.name !== name);
    setSavedLocations(updated);
    await AsyncStorage.setItem('SAVED_LOCATIONS', JSON.stringify(updated));
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>
        {savedLocations.length > 0
          ? ` Current Number of saved locations (${savedLocations.length})`
          : 'Saved Locations'}
      </Text>

      {savedLocations.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 50 }}>
          <Text>No saved locations.</Text>
        </View>
      ) : (
        savedLocations.map((loc) => (
          <View
            key={loc.name}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 12,
              marginBottom: 10,
              borderRadius: 8,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
              alignContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}>
              <Text
                style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
                {loc.name} — {loc.region} — {loc.country}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
              <FontAwesome.Button
                name="trash"
                size={22}
                color="red"
                backgroundColor="#1e1e1e"
                style={{
                  padding: 10,
                  margin: 5,
                  width: '100%',
                }}
                onPress={() => removeLocation(loc.name)}>
                Remove
              </FontAwesome.Button>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default SavedLocations;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
