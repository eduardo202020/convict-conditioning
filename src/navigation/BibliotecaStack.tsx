import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { BigSixScreen } from '../screens/library/BigSixScreen';
import { MediaViewerScreen } from '../screens/library/MediaViewerScreen';
import { MovementScreen } from '../screens/library/MovementScreen';
import { StepDetailScreen } from '../screens/library/StepDetailScreen';
import { BibliotecaStackParamList } from './types';

const Stack = createNativeStackNavigator<BibliotecaStackParamList>();

export function BibliotecaStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen component={BigSixScreen} name="BigSix" />
      <Stack.Screen component={MovementScreen} name="Movement" />
      <Stack.Screen component={StepDetailScreen} name="StepDetail" />
      <Stack.Screen component={MediaViewerScreen} name="MediaViewer" />
    </Stack.Navigator>
  );
}
