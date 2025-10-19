import { StyleSheet, View, ScrollView, TouchableOpacity, Image, Text } from 'react-native';
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
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 12 }}>Saved Locations</Text>

      {savedLocations.length === 0 ? (
        <Text>No saved locations.</Text>
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
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text>
              {loc.name} — {loc.region} — {loc.country}
            </Text>
            <TouchableOpacity onPress={() => removeLocation(loc.name)}>
              <Text style={{ color: 'red', fontWeight: 'bold' }}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default SavedLocations;

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
