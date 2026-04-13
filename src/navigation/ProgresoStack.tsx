import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MovementProgressScreen } from '../screens/progress/MovementProgressScreen';
import { ProgressOverviewScreen } from '../screens/progress/ProgressOverviewScreen';
import { ProgresoStackParamList } from './types';

const Stack = createNativeStackNavigator<ProgresoStackParamList>();

export function ProgresoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={ProgressOverviewScreen} name="ProgressOverview" />
      <Stack.Screen component={MovementProgressScreen} name="MovementProgress" />
    </Stack.Navigator>
  );
}
