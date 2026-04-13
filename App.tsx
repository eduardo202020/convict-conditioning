import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  Newsreader_400Regular_Italic,
  Newsreader_700Bold,
  Newsreader_700Bold_Italic,
  Newsreader_800ExtraBold,
  useFonts as useNewsreaderFonts,
} from '@expo-google-fonts/newsreader';
import {
  PublicSans_400Regular,
  PublicSans_700Bold,
  useFonts as usePublicSansFonts,
} from '@expo-google-fonts/public-sans';

import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme';

export default function App() {
  const [newsreaderLoaded] = useNewsreaderFonts({
    Newsreader_400Regular_Italic,
    Newsreader_700Bold,
    Newsreader_700Bold_Italic,
    Newsreader_800ExtraBold,
  });
  const [publicSansLoaded] = usePublicSansFonts({
    PublicSans_400Regular,
    PublicSans_700Bold,
  });

  if (!newsreaderLoaded || !publicSansLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator color={colors.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </SafeAreaProvider>
  );
}
