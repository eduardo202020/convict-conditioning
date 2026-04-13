import { StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AppHeader } from '../../components/AppHeader';
import { Screen } from '../../components/Screen';
import { BibliotecaStackParamList } from '../../navigation/types';
import { colors, spacing, typography } from '../../theme';

type Props = NativeStackScreenProps<BibliotecaStackParamList, 'MediaViewer'>;

export function MediaViewerScreen({ route }: Props) {
  return (
    <Screen>
      <AppHeader
        eyebrow="VISOR MULTIMEDIA"
        title={route.params.title.toUpperCase()}
        description="Espacio limpio para inspeccionar imagenes y referencias de video del ejercicio."
      />

      <View style={styles.viewer}>
        <MaterialCommunityIcons color={colors.primary} name="image-filter-center-focus" size={42} />
        <Text style={styles.copy}>Aqui ira el visor de imagen o reproductor de video del paso.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  viewer: { marginHorizontal: spacing.lg, marginTop: spacing.xl, minHeight: 320, backgroundColor: colors.surfaceContainer, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.lg },
  copy: { ...typography.body, color: colors.onSurfaceVariant, textAlign: 'center' },
});
