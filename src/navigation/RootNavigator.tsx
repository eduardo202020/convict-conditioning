import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { CurrentProgramScreen } from '../screens/profile/CurrentProgramScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { SettingsScreen } from '../screens/profile/SettingsScreen';
import { ChooseProgramScreen } from '../screens/onboarding/ChooseProgramScreen';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';
import { SetInitialLevelsScreen } from '../screens/onboarding/SetInitialLevelsScreen';
import { colors } from '../theme';
import { TabsNavigator } from './TabsNavigator';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    primary: colors.tertiary,
    text: colors.onSurface,
    border: colors.outlineVariant,
    notification: colors.primary,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
        <Stack.Screen component={OnboardingScreen} name="Onboarding" />
        <Stack.Screen component={ChooseProgramScreen} name="ChooseProgram" />
        <Stack.Screen component={SetInitialLevelsScreen} name="SetInitialLevels" />
        <Stack.Screen component={TabsNavigator} name="MainTabs" />
        <Stack.Screen component={ProfileScreen} name="Profile" />
        <Stack.Screen component={CurrentProgramScreen} name="CurrentProgram" />
        <Stack.Screen component={SettingsScreen} name="Settings" />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
