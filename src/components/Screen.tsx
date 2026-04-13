import { PropsWithChildren } from 'react';
import { ScrollView, StyleProp, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme';

type Props = PropsWithChildren<{ scroll?: boolean; contentContainerStyle?: StyleProp<ViewStyle>; style?: StyleProp<ViewStyle> }>;

export function Screen({ children, scroll = true, contentContainerStyle, style }: Props) {
  if (scroll) {
    return (
      <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }, style]}>
        <ScrollView contentContainerStyle={[{ paddingBottom: 120 }, contentContainerStyle]} showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: colors.background }, style]}>
      <View style={[{ flex: 1 }, contentContainerStyle]}>{children}</View>
    </SafeAreaView>
  );
}
