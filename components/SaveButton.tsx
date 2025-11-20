import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SaveButton = ({
  isSaved,
  saveLocation,
  removeLocation,
}: {
  isSaved: boolean;
  saveLocation: () => void;
  removeLocation: () => void;
}) => {
  const navigate = useNavigation();

  return (
    <>
      {isSaved ? (
        <View
          style={{
            flex: 1,
            marginVertical: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <FontAwesome.Button
            name="star"
            size={22}
            color="gold"
            backgroundColor="#1e1e1e"
            style={{ alignItems: 'center', textAlign: 'center', alignContent: 'center' }}>
            Saved
          </FontAwesome.Button>
          <FontAwesome.Button
            name="list"
            size={22}
            color="white"
            backgroundColor="#1e1e1e"
            onPress={() => navigate.navigate('Saved Locations' as never)}
            style={{ textAlign: 'center' }}>
            View Saved Locations
          </FontAwesome.Button>
          <FontAwesome.Button
            name="trash"
            size={22}
            color="red"
            backgroundColor="#1e1e1e"
            style={{ alignItems: 'center', textAlign: 'center', alignContent: 'center' }}
            onPress={removeLocation}>
            Remove
          </FontAwesome.Button>
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            marginVertical: 5,
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <FontAwesome.Button
            name="star-o"
            size={22}
            color="white"
            backgroundColor="#1e1e1e"
            onPress={saveLocation}
            style={{ textAlign: 'center' }}>
            Save to Favorites
          </FontAwesome.Button>
          <FontAwesome.Button
            name="list"
            size={22}
            color="white"
            backgroundColor="#1e1e1e"
            onPress={() => navigate.navigate('Saved Locations' as never)}
            style={{ textAlign: 'center' }}>
            View Saved Locations
          </FontAwesome.Button>
        </View>
      )}
    </>
  );
};

export default SaveButton;

const styles = {
  button: 'items-center bg-indigo-500 rounded-[28px] shadow-md p-4',
  buttonText: 'text-white text-lg font-semibold text-center',
};
