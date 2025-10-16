import { createStaticNavigation, StaticParamList } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Overview from '../screens/MainSearch';
import Details from '../screens/SavedLocations';
import { BackButton } from '../components/BackButton';

const Stack = createNativeStackNavigator({
  screens: {
    Overview: {
      screen: Overview,
    },
    Details: {
      screen: Details,
      options: ({ navigation }) => ({
        headerLeft: () => <BackButton onPress={navigation.goBack} />,
      }),
    },
  },
});

type RootNavigatorParamList = StaticParamList<typeof Stack>;

declare global {
  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RootParamList extends RootNavigatorParamList {}
  }
}

const Navigation = createStaticNavigation(Stack);
export default Navigation;
