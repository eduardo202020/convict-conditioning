import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, typography } from '../theme';
import { BibliotecaStack } from './BibliotecaStack';
import { HoyStack } from './HoyStack';
import { MainTabParamList } from './types';
import { ProgresoStack } from './ProgresoStack';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: 'rgba(229,226,218,0.16)',
          height: 84,
          paddingBottom: 12,
          paddingTop: 10,
        },
        tabBarActiveTintColor: colors.tertiary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarLabelStyle: {
          ...typography.label,
          fontSize: 10,
        },
        tabBarIcon: ({ color, size }) => {
          const icon =
            route.name === 'HoyStack'
              ? 'calendar-today'
              : route.name === 'ProgresoStack'
                ? 'chart-box-outline'
                : 'bookshelf';

          return <MaterialCommunityIcons color={color} name={icon} size={size} />;
        },
      })}
    >
      <Tab.Screen component={HoyStack} name="HoyStack" options={{ title: 'HOY' }} />
      <Tab.Screen component={ProgresoStack} name="ProgresoStack" options={{ title: 'PROGRESO' }} />
      <Tab.Screen component={BibliotecaStack} name="BibliotecaStack" options={{ title: 'BIBLIOTECA' }} />
    </Tab.Navigator>
  );
}
