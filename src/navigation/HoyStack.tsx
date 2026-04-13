import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ActiveSessionScreen } from '../screens/today/ActiveSessionScreen';
import { SessionSummaryScreen } from '../screens/today/SessionSummaryScreen';
import { TodayScreen } from '../screens/today/TodayScreen';
import { HoyStackParamList } from './types';

const Stack = createNativeStackNavigator<HoyStackParamList>();

export function HoyStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={TodayScreen} name="Today" />
      <Stack.Screen component={ActiveSessionScreen} name="ActiveSession" />
      <Stack.Screen component={SessionSummaryScreen} name="SessionSummary" />
    </Stack.Navigator>
  );
}
