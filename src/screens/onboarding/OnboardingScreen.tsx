import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AppButton } from '../../components/AppButton';
import { Screen } from '../../components/Screen';
import { RootStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  return (
    <Screen scroll={false}>
      <ImageBackground
        resizeMode="cover"
        source={require('../../../data/Convict.webp')}
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <Text style={styles.eyebrow}>MANUAL DE CAMPO NO. 01</Text>
          <Text style={styles.title}>
            CONVICT{'\n'}
            <Text style={styles.titleAccent}>CONDITIONING</Text>
          </Text>
          <View style={styles.copyRow}>
            <View style={styles.bar} />
            <Text style={styles.copy}>
              La maestria del peso corporal. Sin maquinas. Sin adornos. Solo progresion,
              constancia y control.
            </Text>
          </View>

          <View style={styles.footer}>
            <AppButton label="EMPEZAR EL ENTRENAMIENTO" onPress={() => navigation.navigate('ChooseProgram')} />
            <Text style={styles.footnote}>Basado en los Big Six y sus diez pasos de progresion.</Text>
          </View>
        </View>
      </ImageBackground>
    </Screen>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  imageStyle: { opacity: 0.28 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20,20,15,0.84)' },
  content: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xxxl, justifyContent: 'space-between' },
  eyebrow: { ...typography.label, color: colors.primary },
  title: { ...typography.display, color: colors.onSurface, marginTop: 90, fontSize: 54, lineHeight: 52 },
  titleAccent: { color: colors.primary, fontFamily: 'Newsreader_700Bold_Italic', marginLeft: spacing.md },
  copyRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl, alignItems: 'flex-start' },
  bar: { width: 4, height: 88, backgroundColor: colors.outlineVariant },
  copy: { ...typography.title, color: colors.secondary, flex: 1 },
  footer: { gap: spacing.lg, paddingBottom: spacing.xxxl },
  footnote: { ...typography.caption, color: colors.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 1.2 },
});
